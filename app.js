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

  returnSearchResult(displayAlert = false, keyword = '') {
    return {
      displayAlert,
      keyword: keyword.trim(),
      message: utils.returnAlertMessage(keyword.trim())
    }
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
  }
}

// view engine
app.engine('handlebars', engine({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// middleware
app.use(express.static('public'))
app.use(express.urlencoded({ extended: false }))

// server route
app.get('/', async (req, res) => {
  return view.renderIndexPage(res, await model.getRestaurants(), model.returnSearchResult(false))
})

app.get('/restaurants/new', (req, res) => {
  return res.render('new')
})

app.get('/restaurants/:id', async (req, res) => {
  const restaurant = await model.getRestaurant(req.params.id)
  return view.renderShowPage(res, restaurant)
})

app.post('/restaurants', (req, res) => {
  const newRestaurant = utils.returnRestaurantFromBody(req, res)
  Restaurant
    .create(newRestaurant)
    .then(() => res.redirect('/'))
    .catch( error => console.error(error))
})

app.get('/search', async (req, res) => {
  if (utils.isSearchQueryEmpty(req)) {
    const restaurantsToRender = []
    const keyword = ''
    return view.renderIndexPage(res, restaurantsToRender, model.returnSearchResult(true, keyword))
  }

  const keyword = req.query.keyword.trim()
  const regex = new RegExp(keyword, 'gi')

  const restaurants = await model.getRestaurants()
  const restaurantsFiltered = restaurants
    .filter(restaurant => {
      return restaurant.name.match(regex) || restaurant.name_en.match(regex) || restaurant.category.match(regex)
    })

  if (restaurantsFiltered.length > 0) {
    return view.renderIndexPage(res, restaurantsFiltered, model.returnSearchResult(false, keyword))
  }
  return view.renderIndexPage(res, restaurantsFiltered, model.returnSearchResult(true, keyword))
})

app.get('/restaurants/:id/edit', async (req, res) => {
  const restaurant = await model.getRestaurant(req.params.id)
  res.render('edit', { restaurant })
})

app.post('/restaurants/:id/edit', async (req, res) => {
  const id = req.params.id
  const modifiedRestaurant = utils.returnRestaurantFromBody(req, res)

  const updateRestaurantQuery = await Restaurant
    .findByIdAndUpdate(id, modifiedRestaurant, { new: true, upsert: true })
    .then(updatedRestaurant => res.redirect('/restaurants/' + id) )
    .catch( error => console.error(error))
})

app.post('/restaurants/:id/delete', async (req, res) => {
  const restaurantQuery = await Restaurant
    .findByIdAndRemove(req.params.id)
    .then( restaurantFound => res.redirect('/'))
    .catch( error => console.error(error))
})



// server listen
app.listen(port, () => console.log(`Express is listening on localhost:${port}...`))