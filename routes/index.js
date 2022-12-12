const { Router } = require('express')
const userRouter = require('./users')
const recordsRouter = require('./records')
const router = Router()
router.use('/users', userRouter)
router.use('./records', recordsRouter)
module.exports = router
