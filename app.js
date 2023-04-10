// Requirements
if (process.env.NODE_ENV !== 'production') {
  const result = require('dotenv').config()
  if (result.error) throw new Error('Please provide .env file')
}
const corsConfig = require('./config/cors')
const morganConfig = require('./config/morgan')
const express = require('express')
const UAParser = require('ua-parser-js')
const cookieParser = require('cookie-parser')
const swaggerUi = require('swagger-ui-express')
const passport = require('./config/passport')
const router = require('./routes')
const swaggerDocument = require('./swagger/swagger-output.json')
const redisClient = require('./config/redis')
const { dayjs } = require('./helpers/timeHelper')
// Constants
const port = Number(process.env.PORT ?? 3000)
const app = express()
// Middlewares
app.use(cookieParser('cookie-secret'))
app.use(corsConfig)
app.use(morganConfig)
app.use(express.json())
app.use(passport.initialize())
app.use((req, res, next) => {
  const userAgent = new UAParser(req.headers['user-agent'])
  const result = userAgent.getResult()
  req.userAgent = result
  next()
})
app.use('/api-doc', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
app.use('/', router)
// Listening
app.listen(port, () => {
  console.info('Server starts at ' + dayjs().toISOString())
  redisClient.connect()
})
