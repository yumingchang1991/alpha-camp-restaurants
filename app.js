const express = require('express')
const { engine } = require('express-handlebars')
const app = express()

// view engine
app.engine('handlebars', engine({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

app.use(express.static('public'))

const port = 3000

// server route


// server listen
app.listen(port, () => console.log(`Express is listening on localhost:${port}...`))