const express = require('express')
const colors = require('colors')
const dotenv = require('dotenv').config()
const { errorHandler } = require('./app/Middleware/ErrorMiddleware')
const connectDB = require('./config/db')

const port = process.env.PORT || 5000

connectDB()

const app = express()


app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/api', require('./routes/api'))

app.use(errorHandler)

app.listen(port, ()=> console.log(`Runing on port ${port}`))