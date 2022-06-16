const router = require('express').Router()
const passport = require('passport')
const bcrypt = require('bcryptjs')
const User = require('../../models/user')

router.route('/login').get((req, res) => {
  res.render('login')
})

router.route('/login').post(passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login'
}))

router.route('/register').get((req, res) => {
  res.render('register')
})

router.route('/register').post((req, res) => {
  const { username, email, password, confirmPassword } = req.body
  if (!email || !password) {
    req.flash('warning_msg', 'Please fill in both email and password.')
    return res.render('register', { warning_msg: req.flash('warning_msg') })
  }
  if (password !== confirmPassword) {
    req.flash('warning_msg', 'Please ensure passwords are identical.')
    return res.render('register', { warning_msg: req.flash('warning_msg') })
  }

  User.findOne({ email })
    .lean()
    .then( user => {
      console.log(user)
      if (user) {
        req.flash('warning_msg', 'This email is already registered.')
        return res.render('register', {
          username,
          email,
          password,
          confirmPassword,
          warning_msg: req.flash('warning_msg')
        })
      }
      return bcrypt
        .genSalt(10)
        .then(salt => bcrypt.hash(password, salt))  
        .then(hash => {
          return User.create({
            username,
            email,
            password: hash
          })
        })
        .then(() => res.redirect('/'))
        .catch(error => console.log(error))
  })
})

router.route('/logout').get((req, res) => {
  req.logout(function (err) {
    if (err) { return next(err); }
    req.flash('success_msg', 'You have logged out successfully')
    res.redirect('/users/login')
  });
})

module.exports = router