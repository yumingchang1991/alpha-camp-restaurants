const Restaurant = require('../models/restaurant')
const utils = require('../utility')

const model = {
  async getRestaurants () {
    let restaurantsFound = []
    await Restaurant
      .find()
      .sort({
        rating: 'desc',
        name_en: 'asc'
      })
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

  returnIndexPageOptions (displayAlert = false, keyword = '') {
    return {
      keyword: keyword.trim(),
      displayAlert,
      message: utils.returnAlertMessage(keyword.trim())
    }
  },

  async returnRestaurantsFound (keyword) {
    const regex = new RegExp(keyword, 'gi')
    let restaurantsFound = []
    await Restaurant.find({
      $or: [
        { name: regex },
        { name_en: regex },
        { category: regex }
      ]
    })
      .sort({
        rating: 'desc',
        name_en: 'asc'
      })
      .lean()
      .then(restaurants => { restaurantsFound = restaurants.slice() })
      .catch(error => console.error(error))

    return restaurantsFound
  }
}

module.exports = model
