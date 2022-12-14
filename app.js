// Requirements
if (process.env.NODE_ENV !== 'production') {
  const result = require('dotenv').config()
  if (result.error) { throw new Error('Please provide .env file') }
}
const cors = require('cors')
const express = require('express')
const swaggerUi = require('swagger-ui-express')
const passport = require('./config/passport')
const router = require('./routes/index')
const swaggerDocument = require('./swagger/swagger-output.json')
const redisClient = require('./config/redis')
const morgan = require('morgan')
// Constants
const port = Number(process.env.PORT ?? 3000)
const app = express()
// Middlewares
app.use(cors())
app.use(express.json())
app.use(passport.initialize())
app.use(morgan(':method, :url, :date'))
app.use('/api-doc', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
app.use('/', router)

// Listening
app.listen(port, async () => {
  console.info('Server starts.')
  await redisClient.connect()
  console.info('Redis start.')
})
