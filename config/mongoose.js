const mongoose = require('mongoose')
require('dotenv').config()

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })

const mongoDb = mongoose.connection

mongoDb.on('error', () => console.log('mongoDb connection error'))
mongoDb.once('open', () => console.log('mongoDb is connected'))

module.exports = mongoDb
