const { Router } = require('express')
const userRouter = require('./modules/users')
const recordsRouter = require('./modules/records')
const { authenticator: { jwtAuthenticator, localAuthenticator } } = require('../middlewares')
const router = Router()

router.post('/signIn', localAuthenticator)

router.use('/users', jwtAuthenticator, userRouter)
router.use('/records', jwtAuthenticator, recordsRouter)
module.exports = router
