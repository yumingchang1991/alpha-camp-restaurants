const mongoDb = require('../../config/mongoose')
const Restaurant = require('../restaurant.js')
const restaurantsJSON = require('../../restaurant.json')
const model = {
  "restaurants": restaurantsJSON.results
}

mongoDb.once('open', () => {
  // Delete all documents on MongoDb
  Restaurant
    .find()
    .deleteMany()
    .exec()
    .then(() => {
      console.log('All restaurants are deleted ...')
      createSeeds()
    })
    .catch( error => console.error(error))

})

function createSeeds() {
  for (let i = 0; i < model.restaurants.length; i++) {
    Restaurant
      .create({
        name: model.restaurants[i].name,
        name_en: model.restaurants[i].name_en,
        category: model.restaurants[i].category,
        image: model.restaurants[i].image,
        location: model.restaurants[i].location,
        phone: model.restaurants[i].phone,
        google_map: model.restaurants[i].google_map,
        rating: model.restaurants[i].rating,
        description: model.restaurants[i].description
      })
      .catch(error => console.error(error))
  }
  console.log('Complete resetting MongoDB with seeds data only ...')
}