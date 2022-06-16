if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const express = require('express')
const { engine } = require('express-handlebars')
const methodOverride = require('method-override')

const session = require('express-session')
const usePassport = require('./config/passport')
const routes = require('./routes')
const flash = require('connect-flash')
require('./config/mongoose')
require('./models/restaurant.js')

const app = express()
const port = 3000

// view engine
app.engine('handlebars', engine({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// middleware
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}))
app.use(express.static('public'))
app.use(express.urlencoded({ extended: false }))
app.use(methodOverride('_method'))

usePassport(app)
app.use(flash())
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.user = req.user
  res.locals.success_msg = req.flash('success_msg')
  res.locals.warning_msg = req.flash('warning_msg')
  next()
})
// routes
app.use(routes)

// server listen
app.listen(port, () => console.log(`Express is listening on localhost:${port}...`))
