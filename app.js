/* eslint-disable no-unused-vars */
// Requirements
import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import passport from './config/passport.js'
import router from './routes/index.js'
if (process.env.NODE_ENV !== 'prodution') {
  const result = dotenv.config()
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
