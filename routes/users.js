import { Router } from 'express'
const userRouter = Router()
userRouter.post('/signin')
userRouter.put('/:id')
export default userRouter
