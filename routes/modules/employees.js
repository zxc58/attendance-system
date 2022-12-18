const { Router } = require('express')
const { employeeController } = require('../../controllers')
const router = Router()
router.get(
  '/', employeeController.getEmployee
  // #swagger.tags = ['Employee']
  // #swagger.description = 'Get personal data'
)

router.put(
  '/:id', employeeController.putEmployee
  // #swagger.tags = ['Employee']
  // #swagger.description = 'Update personal data'
)

module.exports = router
