const mongoDb = require('../../config/mongoose')
const Restaurant = require('../restaurant.js')
const restaurantsJSON = require('../../restaurant.json')

mongoDb.once('open', () => {
  // Delete all documents on MongoDb
  Restaurant
    .find()
    .deleteMany()
    .then(() => {
      console.log('All restaurants are deleted ...')
      createSeeds()
    })
    .catch(error => console.error(error))
})

function createSeeds () {
  Restaurant
    .create(restaurantsJSON.results)
    .catch(error => console.error(error))
    .finally(() => mongoDb.close())
  console.log('Complete resetting MongoDB with seeds data only ...')
}
