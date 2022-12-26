const { Router } = require('express')
const { employeeController } = require('../../controllers')
const router = Router()
const { validator: { distance, password, validationCallback } } = require('../../middlewares')
router.get(
  '/', employeeController.getEmployee
  // #swagger.tags = ['Employee']
  // #swagger.description = 'Get personal data'
)

router.put(
  '/:id', [distance, password, validationCallback], employeeController.putEmployee
  // #swagger.tags = ['Employee']
  // #swagger.description = 'Update personal data'
)

module.exports = router
