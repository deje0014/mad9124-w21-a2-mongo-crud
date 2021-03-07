// Don't forget to use NPM to install Express and Mongoose.

const morgan =  require('morgan')
const express = require('express')
const studentsRouter = require('./routes/students')
const coursesRouter = require('./routes/courses')

require('./startup/connectDatabase')()

const app = express()

app.use(morgan('tiny'))
app.use(express.json())
// app.use(sanitizeMongo())

// routes
app.use('/api/students', studentsRouter)
app.use('/api/courses', coursesRouter)


module.exports = app