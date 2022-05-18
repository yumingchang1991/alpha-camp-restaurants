const express = require('express')
const mongoDb = require('./connection.js')
const Restaurant = require('./models/restaurant.js')
const { engine } = require('express-handlebars')

const app = express()
const port = 3000

const utils = {
  returnAlertMessage(keyword) {
    return keyword.trim().length > 0
      ? `Oops, we couldn't find a match for '${keyword.trim()}'. Try another one?`
      : `Seriously? Your keyword is empty... Try type something and hit search again`
  },

  isSearchQueryEmpty(req) {
    return !req.query || req.query.keyword.trim().length === 0
  },

  returnRestaurantFromBody(req, res) {
    if (!req.body) {
      return res.redirect('/')
    }
    return {
      name: req.body.name,
      name_en: req.body.name_en,
      category: req.body.category,
      rating: req.body.rating,
      location: req.body.location,
      phone: req.body.phone,
      image: req.body.image,
      google_map: req.body.google_map,
      description: req.body.description
    }
  }
}

const model = {
  async getRestaurants() {
    let restaurantsFound = []
    const restaurantsQuery = await Restaurant
      .find()
      .sort({
        rating: 'desc',
        name_en: 'asc'
      })
      .lean()
      .then(restaurants => restaurantsFound = restaurants.slice())
      .catch(error => console.error(error))

    return restaurantsFound
  },

  async getRestaurant(id) {
    const restaurantFound = {}
    const restaurantQuery = await Restaurant
      .findById(id)
      .lean()
      .then(restaurant => Object.assign(restaurantFound, restaurant))
      .catch(error => console.error(error))

    return restaurantFound
  },

  returnIndexPageOptions(displayAlert = false, keyword = '') {
    return {
      keyword: keyword.trim(),
      displayAlert,
      message: utils.returnAlertMessage(keyword.trim())
    }
  },

  async returnRestaurantsSearchResult(keyword) {
    const regex = new RegExp(keyword, 'gi')
    const restaurants = await model.getRestaurants()
    return restaurants.filter(restaurant => {
      return restaurant.name.match(regex) || restaurant.name_en.match(regex) || restaurant.category.match(regex)
    })
  }
}

const view = {
  renderIndexPage(res, restaurantsToRender, searchResult) {
    return res.render('index', {
      restaurants: restaurantsToRender,
      searchResult
    })
  },

  renderShowPage(res, restaurant) {
    return res.render('show', { restaurant })
  },

  renderNewPage(res) {
    return res.render('new')
  },

  renderEditPage(res, restaurant) {
    return res.render('edit', { restaurant })
  }
}

// view engine
app.engine('handlebars', engine({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// middleware
app.use(express.static('public'))
app.use(express.urlencoded({ extended: false }))

// routing
app.route('/')
  .get(async (req, res) => {
    const restaurantsToRender = await model.getRestaurants()
    const indexPageOptions = model.returnIndexPageOptions(false)
    return view.renderIndexPage(res, restaurantsToRender, indexPageOptions)
  })

app.route('/restaurants')
  .post((req, res) => {
    const newRestaurant = utils.returnRestaurantFromBody(req, res)
    return Restaurant
      .create(newRestaurant)
      .then(() => res.redirect('/'))
      .catch(error => console.error(error))
  })

app.route('/restaurants/new')
  .get((req, res) => {
    return view.renderNewPage(res)
  })

app.route('/restaurants/:id')
  .get(async (req, res) => {
    const restaurant = await model.getRestaurant(req.params.id)
    return view.renderShowPage(res, restaurant)
  })

app.route('/restaurants/:id/edit')
  .get(async (req, res) => {
    const restaurant = await model.getRestaurant(req.params.id)
    return view.renderEditPage(res, restaurant)
  })

app.route('/restaurants/:id/edit')
  .post((req, res) => {
    const id = req.params.id
    const modifiedRestaurant = utils.returnRestaurantFromBody(req, res)

    Restaurant
      .findByIdAndUpdate(id, modifiedRestaurant, { new: true, upsert: true })
      .then(updatedRestaurant => res.redirect('/restaurants/' + id))
      .catch(error => console.error(error))
  })

app.route('/restaurants/:id/delete')
  .post((req, res) => {
    Restaurant
      .findByIdAndRemove(req.params.id)
      .then(restaurantFound => res.redirect('/'))
      .catch(error => console.error(error))
  })

app.route('/search')
  .get(async (req, res) => {
    // is query string valid ?
    if (utils.isSearchQueryEmpty(req)) {
      const restaurantsToRender = []
      const keyword = ''
      const indexPageOptions = model.returnIndexPageOptions(true, keyword)
      return view.renderIndexPage(res, restaurantsToRender, indexPageOptions)
    }

    // Declare variables for search
    const keyword = req.query.keyword.trim()
    const restaurantsFiltered = await model.returnRestaurantsSearchResult(keyword)
    const displayAlert = (restaurantsFiltered.length === 0) ? true : false
    const indexPageOptions = model.returnIndexPageOptions(displayAlert, keyword)
    return view.renderIndexPage(res, restaurantsFiltered, indexPageOptions)
  })


// server listen
app.listen(port, () => console.log(`Express is listening on localhost:${port}...`))