const bcrypt = require('bcryptjs')
const mongoDb = require('../../config/mongoose')
const Restaurant = require('../restaurant')
const User = require('../user')
const restaurantsJSON = require('../../restaurant.json')

const SEED_USERS = [
  {
    email: 'user1@example.com',
    password: '12345678',
    restaurantsId: [1, 2, 3]
  },
  {
    email: 'user2@example.com',
    password: '12345678',
    restaurantsId: [4, 5, 6]
  }
]

mongoDb.once('open', () => {
  // Delete all documents on MongoDb
  Restaurant
    .find()
    .deleteMany()
    .then(() => {
      console.log('All restaurants are deleted ...')
      createSeeds()
      process.exit()
    })
    .catch(error => console.error(error))
})

function createSeeds () {
  Restaurant
    .create(restaurantsJSON.results)
    .catch(error => console.error(error))
    .finally(() => mongoDb.close())
  console.log('Seeds data are created ...')
}
