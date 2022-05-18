const express = require('express')
const mongoDb = require('./connection.js')
const Restaurant = require('./models/restaurant.js')
const { engine } = require('express-handlebars')

const app = express()
const port = 3000

// data
const model = {
  async getRestaurants() {
    let queryResult = []
    const query = await Restaurant
      .find()
      .sort({
        rating: 'desc',
        name_en: 'asc'
       })
      .lean()
      .then(restaurants => queryResult = restaurants.slice())
      .catch(error => console.error(error))
    return queryResult
  },

  returnSearchResult(displayAlert = false, keyword = '') {
    let finalMessage = ''
    if (displayAlert) {
      if (keyword.trim().length > 0) {
        finalMessage = `Oops, we couldn't find a match for '${keyword}'. Try another one?`
      } else {
        finalMessage = `Seriously? Your keyword is empty... 
        Try type something and hit search again.`
      }
    }
    return {
      displayAlert,
      keyword: keyword.trim(),
      message: finalMessage
    }
  },
}

const view = {
  renderIndexPageWithAlert(res, keyword) {
    return res.render('index', {
      restaurants: model.restaurants,
      searchResult: model.returnSearchResult(true, keyword)
    })
  },

  renderIndexPage(res, keyword = '', arrayToRender) {
    return res.render('index', {
      restaurants: arrayToRender,
      searchResult: model.returnSearchResult(false, keyword)
    })
  }
}

// view engine
app.engine('handlebars', engine({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// static
app.use(express.static('public'))

// server route
app.get('/', async (req, res) => {
  res.render('index', {
    restaurants: await model.getRestaurants(),
    searchResult: model.returnSearchResult(false)
  })
})
  
  

app.get('/restaurants/:id', (req, res) => {
  const id = req.params.id
  const restaurant = model.restaurants.find(restaurant => restaurant.id.toString() === id)
  res.render('show', { restaurant })
})

app.get('/search', (req, res) => {
  if (!req.query) {
    return view.renderIndexPageWithAlert(res)
  }
  if (req.query.keyword.trim().length === 0) {
    return view.renderIndexPageWithAlert(res)
  }
  
  const keyword = req.query.keyword.trim()
  const regex = new RegExp(keyword, 'gi')
  const restaurantsFiltered = 
    model
      .restaurants
      .filter(restaurant => {
          return restaurant.name.match(regex) || restaurant.name_en.match(regex) || restaurant.category.match(regex)
        })

  
  if (restaurantsFiltered.length > 0) {
    return view.renderIndexPage(res, keyword, restaurantsFiltered)
  }
  return view.renderIndexPageWithAlert(res, keyword)

})

// server listen
app.listen(port, () => console.log(`Express is listening on localhost:${port}...`))