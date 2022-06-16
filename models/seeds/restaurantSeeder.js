const bcrypt = require('bcryptjs')
const mongoDb = require('../../config/mongoose')
const Restaurant = require('../restaurant')
const User = require('../user')
const rawJSON = require('../../restaurant.json')

const SEED_USERS = [
  {
    username: 'seed_user1',
    email: 'user1@example.com',
    password: '12345678',
    restaurantIds: [1, 2, 3]
  },
  {
    username: 'seed_user2',
    email: 'user2@example.com',
    password: '12345678',
    restaurantIds: [4, 5, 6]
  }
]

mongoDb.once('open', () => {
  console.log('\n====== Seeder Program Starts ======\n')
  // Delete all documents on MongoDb
  initializeMongoDb()
    .then(() => createSeedUsers())
    .then(users => {
      console.log('step2: creating associated restaurants for each seed user ...')
      return Promise.all(
        Array.from(
          users,
          user => {
            const { restaurantIds } = SEED_USERS.filter(seedUser => seedUser.email === user.email)[0]

            const newRestaurants = restaurantIds.map(restId => {
              const newRestaurant = rawJSON.results.filter(restaurant => restaurant.id === restId)[0]
              newRestaurant.userId = user._id
              return newRestaurant
            })
            return Restaurant
              .create(newRestaurants)
          })
      )
    }
  )
    .then(() => console.log('\nDone!'))
    .then(() => console.log('\n====== Seeder Program Ends ======\n'))
    .then(() => mongoDb.close())
    .catch(error => console.error(error))
})

function initializeMongoDb() {
  return Promise.all(
    [
      Restaurant.find().deleteMany(),
      User.find().deleteMany()
    ]
  )
  .then(() => console.log('step1: deleting MongoDb data ...'))
}

function createSeedUsers() {
  return Promise.all(Array.from(
    SEED_USERS,
    seedUser => {
      // hash password then create user on MongoDB
      return bcrypt.genSalt(10)
        .then(salt => bcrypt.hash(seedUser.password, salt))
        .then(hash => {
          seedUser.password = hash
        })
    }))
    .then(() => User.create(SEED_USERS))
    .catch(error => console.error(error))
}