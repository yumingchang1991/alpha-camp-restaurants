const router = require('express').Router()
const model = require('../../models')
const view = require('../../views')

router
  .route('/')
  .get(async (req, res) => {
    const restaurantsToRender = await model.getRestaurants()
    const indexPageOptions = model.returnIndexPageOptions(false)
    return view.renderIndexPage(res, restaurantsToRender, indexPageOptions)
  })

module.exports = router
