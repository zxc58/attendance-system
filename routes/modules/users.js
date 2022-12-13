const { Router } = require('express')
const { userController } = require('../../controllers')
const router = Router()
router.get('/:id', userController.getUser)
router.put('/:id', userController.putUser)
module.exports = router
