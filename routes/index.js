// Requirements
const { Router } = require('express')

const userRouter = require('./modules/users')
const recordsRouter = require('./modules/records')

const { authenticator: { jwtAuthenticator, localAuthenticator } } = require('../middlewares')

const router = Router()

router.post(
  '/logIn', localAuthenticator
  // #swagger.tags = ['Sign in']
  // #swagger.description = 'Sign in'
)
router.use('/users', jwtAuthenticator, userRouter)
router.use('/records', jwtAuthenticator, recordsRouter)
router.use('/', (req, res) => res.send('concatenated'))
router.use('/', (error, req, res, next) => {
  return console.log(error)
})
module.exports = router
