const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Model = mongoose.model

const RestaurantSchema = new Schema({
  name: String,
  name_en: String,
  category: String,
  image: String,
  location: String,
  phone: String,
  google_map: String,
  rating: Number,
  description: String
})

const Restaurant = Model('Restaurant', RestaurantSchema)

module.exports = Restaurant