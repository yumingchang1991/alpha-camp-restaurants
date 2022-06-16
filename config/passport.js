if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const passport = require('passport')
const bcrypt = require('bcryptjs')
const LocalStrategy = require('passport-local')
const FacebookStrategy = require('passport-facebook')

const User = require('../models/user')

module.exports = app => {
  app.use(passport.initialize())
  app.use(passport.session())

  passport.use(new LocalStrategy(
    { usernameField: 'email', passReqToCallback: true },
    (req, email, password, done) => {
      User.findOne({ email })
        .then(user => {
          if (!user) {
            const errorMessage = "this email is not registered!"
            req.errorMessage = errorMessage
            req.flash('warning_msg', errorMessage)
            return done(null, false, { message: errorMessage })
          }
          return bcrypt.compare(password, user.password)
            .then(isMatch => {
              if (!isMatch) {
                const errorMessage = "incorrect password!"
                req.errorMessage = errorMessage
                req.flash('warning_msg', errorMessage)
                return done(null, false, { message: errorMessage })
              }
              return done(null, user)
            })
            .catch(err => done(err))
        })
    }
  ))

  passport.serializeUser((user, done) => {
    done(null, user.id)
  })
  passport.deserializeUser((id, done) => {
    User.findById(id)
      .lean()
      .then(user => done(null, user))
      .catch(err => done(err))

  })
}