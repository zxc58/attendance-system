/* eslint-disable no-unused-vars */
// Requirements
const cors = require('cors')
const passport = require('./config/passport')
const router = require('./routes/index')
const express = require('express')
if (process.env.NODE_ENV !== 'prodution') {
  const result = require('dotenv').config()
  if (result.error) { throw new Error('Please provide .env file') }
}
// Constants
const port = process.env.PORT ?? 3000
const app = express()
// Middlewares
app.use(cors())
app.use(express.json())
app.use(passport.initialize())
app.use(router)
// Listening
app.listen(port, () => console.log('App start'))
