const mongoDb = require('../../config/mongoose')
const Restaurant = require('../restaurant.js')
const restaurantsJSON = require('../../restaurant.json')

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
    .catch(error => console.error(error))
})

function createSeeds () {
  for (let i = 0; i < restaurantsJSON.results.length; i++) {
    Restaurant
      .create({
        name: restaurantsJSON.results[i].name,
        name_en: restaurantsJSON.results[i].name_en,
        category: restaurantsJSON.results[i].category,
        image: restaurantsJSON.results[i].image,
        location: restaurantsJSON.results[i].location,
        phone: restaurantsJSON.results[i].phone,
        google_map: restaurantsJSON.results[i].google_map,
        rating: restaurantsJSON.results[i].rating,
        description: restaurantsJSON.results[i].description
      })
      .catch(error => console.error(error))
  }
  console.log('Complete resetting MongoDB with seeds data only ...')
}
