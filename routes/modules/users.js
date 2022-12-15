const { Router } = require('express')
const { userController } = require('../../controllers')
const router = Router()
router.get('/', userController.getUser
  // #swagger.tags = ['User']
  // #swagger.description = 'Get personal data'
)

router.put('/:id', userController.putUser
  // #swagger.tags = ['User']
  // #swagger.description = 'Update personal data (only password)'
)
module.exports = router
