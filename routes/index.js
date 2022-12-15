const { Router } = require('express')
const userRouter = require('./modules/users')
const recordsRouter = require('./modules/records')
const { authenticator: { jwtAuthenticator, localAuthenticator } } = require('../middlewares')
const router = Router()

router.post('/logIn', localAuthenticator)

router.use('/users', jwtAuthenticator, userRouter)
router.use('/records', jwtAuthenticator, recordsRouter)
router.use('/', (req, res) => res.send('concatenated'))
router.use('/', (error, req, res, next) => {
  return res.status(500).json({ status: false, error })
})
module.exports = router
