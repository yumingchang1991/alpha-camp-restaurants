const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Model = mongoose.model

const stringOptions = {
  type: String,
  required: true
}

const numberOptions = {
  type: Number,
  required: true
}

const RestaurantSchema = new Schema({
  name: stringOptions,
  name_en: stringOptions,
  category: stringOptions,
  image: stringOptions,
  location: stringOptions,
  phone: stringOptions,
  google_map: stringOptions,
  rating: numberOptions,
  description: stringOptions
})

const Restaurant = Model('Restaurant', RestaurantSchema)

module.exports = Restaurant
