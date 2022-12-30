// Requirements
const { Router } = require('express')

const employeeRouter = require('./modules/employees')
const attendanceRouter = require('./modules/attendances')
const qrcodeRouter = require('./modules/qrcode')
const { validator: { distance }, authenticator: { jwtAuthenticator, localAuthenticator } } = require('../middlewares')

const router = Router()

router.post(
  '/logIn', localAuthenticator
  // #swagger.tags = ['Sign in']
  // #swagger.description = 'Sign in'
)
router.use('/qrcode', qrcodeRouter)
router.use('/employees', jwtAuthenticator, employeeRouter)
router.use('/attendances', jwtAuthenticator, attendanceRouter)
router.use('/', (req, res) => res.send('concatenated'))
router.use('/', (error, req, res, next) => {
  res.status(500).json({ error })
  return console.log(error)
})
module.exports = router
