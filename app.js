const express = require('express')
const mongoDb = require('./connection.js')
const Restaurant = require('./models/restaurant.js')
const { engine } = require('express-handlebars')

const app = express()
const port = 3000

const controller = {
  returnAlertMessage(keyword) {
    return keyword.trim().length > 0
      ? `Oops, we couldn't find a match for '${keyword.trim()}'. Try another one?`
      : `Seriously? Your keyword is empty... Try type something and hit search again`
  },

  isSearchQueryEmpty(req) {
    return !req.query || req.query.keyword.trim().length === 0
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
      .then( restaurant => Object.assign(restaurantFound, restaurant) )
      .catch( error => console.error(error))

    return restaurantFound
  },

  returnSearchResult(displayAlert = false, keyword = '') {
    return {
      displayAlert,
      keyword: keyword.trim(),
      message: controller.returnAlertMessage(keyword.trim())
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

// static
app.use(express.static('public'))

// server route
app.get('/', async (req, res) => {
  return view.renderIndexPage(res, await model.getRestaurants(), model.returnSearchResult(false))
})

app.get('/restaurants/:id', async (req, res) => {
  const restaurant = await model.getRestaurant(req.params.id)
  return view.renderShowPage(res, restaurant)
})

app.get('/search', async (req, res) => {
  if (controller.isSearchQueryEmpty(req)) {
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

// server listen
app.listen(port, () => console.log(`Express is listening on localhost:${port}...`))