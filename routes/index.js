// Requirements
const { Router } = require('express')
const httpStatus = require('http-status')
const authRouter = require('./modules/auth')
const employeeRouter = require('./modules/employees')
const attendanceRouter = require('./modules/attendances')
const { authenticator: { jwtAuthenticator } } = require('../middlewares')
const router = Router()

router.use('/auth', authRouter)
router.use('/attendances', attendanceRouter)
router.use('/employees', jwtAuthenticator, employeeRouter)

router.use('/', (req, res) => res.status(httpStatus.NOT_FOUND).send({ message: 'Resource not found' }))
router.use('/', (error, req, res, next) => {
  res.status(500).json({ error })
  return console.error(error)
})

module.exports = router
