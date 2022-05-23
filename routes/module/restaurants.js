const router = require('express').Router()

const Restaurant = require('../../models/restaurant')
const model = require('../../models')
const view = require('../../views')
const utils = require('../../utility')

router
  .route('/')
  .post((req, res) => {
    const newRestaurant = utils.returnRestaurantFromBody(req, res)
    return Restaurant
      .create(newRestaurant)
      .then(() => res.redirect('/'))
      .catch(error => console.error(error))
  })

router
  .route('/new')
  .get((req, res) => {
    return view.renderNewPage(res)
  })

router
  .route('/:id')
  .get(async (req, res) => {
    const restaurant = await model.getRestaurant(req.params.id)
    return view.renderShowPage(res, restaurant)
  })

router
  .route('/:id/edit')
  .get(async (req, res) => {
    const restaurant = await model.getRestaurant(req.params.id)
    return view.renderEditPage(res, restaurant)
  })

router
  .route('/:id')
  .put((req, res) => {
    const id = req.params.id
    const modifiedRestaurant = utils.returnRestaurantFromBody(req, res)

    Restaurant
      .findByIdAndUpdate(id, modifiedRestaurant, { new: true, upsert: true })
      .then(updatedRestaurant => res.redirect('/restaurants/' + id))
      .catch(error => console.error(error))
  })

router
  .route('/:id')
  .delete((req, res) => {
    Restaurant
      .findByIdAndRemove(req.params.id)
      .then(restaurantFound => res.redirect('/'))
      .catch(error => console.error(error))
  })

module.exports = router
