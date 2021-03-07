// Don't forget to use NPM to install Express and Mongoose.
const morgan =  require('morgan')
const express = require('express')
const sanitizedBody = require('./middleware/sanitizeBody')

require('./startup/connectDatabase')()

const app = express()

app.use(morgan('tiny'))
app.use(express.json())

// routes

app.post('/test', sanitizedBody, (req, res) => {
    res.status(201).send(req.sanitizedBody)
})


module.exports = app