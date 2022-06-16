const Restaurant = require('../models/restaurant')
const User = require('./user')
const utils = require('../utility')

const model = {
  async getRestaurants (req) {
    const sortOption = this.returnSortOption(req.query)
    let restaurantsFound = []
    await Restaurant
      .find({ userId: req.user._id })
      .limit(20)
      .sort(sortOption)
      .lean()
      .then(restaurants => { restaurantsFound = restaurants.slice() })
      .catch(error => console.error(error))

    return restaurantsFound
  },

  async getRestaurant (id) {
    const restaurantFound = {}
    await Restaurant
      .findById(id)
      .lean()
      .then(restaurant => Object.assign(restaurantFound, restaurant))
      .catch(error => console.error(error))

    return restaurantFound
  },

  returnIndexPageOptions (req, displayAlert = false) {
    const keyword = req.query.keyword || ""
    
    const toggleSort = {}
    const sortOption = this.returnSortOption(req.query)
    for (let key in sortOption) {
      toggleSort[key] = true
      toggleSort[sortOption[key]] = true
    }

    return {
      keyword,
      sort: toggleSort,
      alert: {
        displayAlert,
        message: utils.returnAlertMessage(keyword)
      }
    }
  },

  async returnRestaurantsFound (req) {
    const sortOption = this.returnSortOption(req.query)
    const keyword = req.query.keyword || ""
    const regex = new RegExp(keyword, 'gi')
    let restaurantsFound = []
    await Restaurant.find({
      userId: req.user._id,
      $or: [
        { name: regex },
        { name_en: regex },
        { category: regex }
      ]
    })
      .limit(20)
      .sort(sortOption)
      .lean()
      .then(restaurants => { restaurantsFound = restaurants.slice() })
      .catch(error => console.error(error))

    return restaurantsFound
  },

  returnSortOption(reqQuery) {
    const sortOption = Object.create(null)
    if (reqQuery.sortField) {
      const { sortField, sortOrder } = reqQuery
      sortOption[sortField] = sortOrder
    } else {
      // default sorting order
      sortOption.rating = 'desc'
      sortOption.name_en = 'asc'
    }
    return sortOption
  },
}

module.exports = model
