const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Model = mongoose.model

const UserSchema = new Schema({
  username: String,
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: String
  }
})

const User = Model('User', UserSchema)
module.exports = User
