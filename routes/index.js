// Requirements
const { Router } = require('express')
const swaggerUi = require('swagger-ui-express')
const userRouter = require('./modules/users')
const recordsRouter = require('./modules/records')
const swaggerDocument = require('../swagger/swagger-output.json')
const { authenticator: { jwtAuthenticator, localAuthenticator } } = require('../middlewares')

const router = Router()

router.use('/docs', swaggerUi.serve)
router.get('/docs', swaggerUi.setup(swaggerDocument))
router.post('/logIn', localAuthenticator)
router.use('/users', jwtAuthenticator, userRouter)
router.use('/records', jwtAuthenticator, recordsRouter)
router.use('/', (req, res) => res.send('concatenated'))
router.use('/', (error, req, res, next) => {
  return res.status(500).json({ status: false, error })
})
module.exports = router
