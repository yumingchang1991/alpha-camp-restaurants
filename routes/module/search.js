const router = require('express').Router()
const model = require('../../models')
const view = require('../../views')
const utils = require('../../utility')

router
  .route('/')
  .get(async (req, res) => {
    // is query string valid ?
    if (utils.isSearchQueryEmpty(req)) {
      const restaurantsToRender = []
      const indexPageOptions = model.returnIndexPageOptions(req, true)
      return view.renderIndexPage(res, restaurantsToRender, indexPageOptions)
    }

    // Declare variables for search
    const keyword = req.query.keyword.trim()
    const restaurantsFound = await model.returnRestaurantsFound(keyword)
    const displayAlert = restaurantsFound.length === 0
    const indexPageOptions = model.returnIndexPageOptions(req, displayAlert)
    return view.renderIndexPage(res, restaurantsFound, indexPageOptions)
  })

module.exports = router
