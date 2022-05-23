const express = require('express')
const { engine } = require('express-handlebars')
const methodOverride = require('method-override')

const routes = require('./routes')
require('./config/mongoose')
require('./models/restaurant.js')

const app = express()
const port = 3000

// view engine
app.engine('handlebars', engine({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// middleware
app.use(express.static('public'))
app.use(express.urlencoded({ extended: false }))
app.use(methodOverride('_method'))

// routes
app.use(routes)

// server listen
app.listen(port, () => console.log(`Express is listening on localhost:${port}...`))
