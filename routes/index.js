// Requirements
const { Router } = require('express')
const httpStatus = require('http-status')
const { Employee } = require('../models')
const employeeRouter = require('./modules/employees')
const attendanceRouter = require('./modules/attendances')
const qrcodeRouter = require('./modules/qrcode')
const adminRouter = require('./modules/admin')
const { authenticator: { jwtAuthenticator, localAuthenticator } } = require('../middlewares')
const jwt = require('jsonwebtoken')
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET
const router = Router()
const { signJWT } = require('../helpers/jwtHelper')
router.post(
  '/logIn', localAuthenticator
  // #swagger.tags = ['Auth']
  // #swagger.description = 'Sign in'
)
router.post('/refresh',
  // #swagger.tags = ['Auth']
  // #swagger.description = 'refresh access token'
  async (req, res) => {
    const { refreshToken } = req.body
    if (!refreshToken) { return res.status(httpStatus.BAD_REQUEST).json({ message: 'No refresh token' }) }
    const refreshTokenPayload = jwt.verify(refreshToken, refreshTokenSecret)
    if (!refreshTokenPayload) { return res.status(httpStatus.BAD_REQUEST).json({ message: 'Refresh token is expired' }) }
    const { userId: id } = refreshTokenPayload
    const employee = await Employee.findByPk(id, { attributes: { exclude: ['password', 'createdAt', 'updatedAt'] } })
    signJWT({ res, user: employee, getRefreshToken: false })
  })
router.use('/admin', adminRouter)
router.use('/qrcode', qrcodeRouter)
router.use('/employees', jwtAuthenticator, employeeRouter)
router.use('/attendances', jwtAuthenticator, attendanceRouter)
router.use('/', (req, res) => res.send('concatenated'))
router.use('/', (error, req, res, next) => {
  res.status(500).json({ error })
  return console.error(error)
})
module.exports = router
