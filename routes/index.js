import { Router } from 'express'
import userRouter from './users.js'
import recordsRouter from './records.js'
const router = Router()
router.use('/users', userRouter)
router.use('./records', recordsRouter)
export default router
