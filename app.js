/* eslint-disable no-unused-vars */
// Requirements
if (process.env.NODE_ENV !== 'production') {
  const result = require('dotenv').config()
  if (result.error) { throw new Error('Please provide .env file') }
}
const cors = require('cors')
const passport = require('./config/passport')
const router = require('./routes/index')
const express = require('express')
// Constants
const port = process.env.PORT ?? 3000
const app = express()
// Middlewares
app.use(cors())
app.use(express.json())
app.use(passport.initialize())
app.use('/api', router)
// Listening
app.listen(port, () => console.log('App start'))
