const router = require('express').Router()
const model = require('../../models')
const view = require('../../views')
const utils = require('../../utility')

router
  .route('/')
  .get(async (req, res) => {
    const keyword = req.query.keyword.trim()
    const restaurantsFound = keyword.length > 0
      ? await model.returnRestaurantsFound(req) || []
      : await model.getRestaurants(req) || []
    
    const displayAlert = restaurantsFound.length === 0
    const indexPageOptions = model.returnIndexPageOptions(req, displayAlert)
    return view.renderIndexPage(res, restaurantsFound, indexPageOptions)
  })

module.exports = router
