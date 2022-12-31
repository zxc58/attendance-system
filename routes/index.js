// Requirements
const { Router } = require('express')
const { Employee } = require('../models')
const employeeRouter = require('./modules/employees')
const attendanceRouter = require('./modules/attendances')
const qrcodeRouter = require('./modules/qrcode')
const { authenticator: { jwtAuthenticator, localAuthenticator } } = require('../middlewares')
const jwt = require('jsonwebtoken')
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET
const router = Router()
const { signJWT } = require('../helpers/jwtHelper')
router.post(
  '/logIn', localAuthenticator
  // #swagger.tags = ['Sign in']
  // #swagger.description = 'Sign in'
)
router.get('/refresh', async (req, res, next) => {
  const { refresh_token: refreshToken } = req.signedCookies
  if (!refreshToken) { return res.status(401).json({ message: 'No refresh token' }) }
  const refreshTokenPayload = jwt.verify(refreshToken, refreshTokenSecret)
  const { userId: id } = refreshTokenPayload
  const employee = await Employee.findByPk(id, { attributes: { exclude: ['password', 'createdAt', 'updatedAt'] } })
  signJWT({ res, user: employee })
})
router.use('/qrcode', qrcodeRouter)
router.use('/employees', jwtAuthenticator, employeeRouter)
router.use('/attendances', jwtAuthenticator, attendanceRouter)
router.use('/', (req, res) => res.send('concatenated'))
router.use('/', (error, req, res, next) => {
  res.status(500).json({ error })
  return console.log(error)
})
module.exports = router
