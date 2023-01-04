const { Router } = require('express')
const { employeeController } = require('../../controllers')
const router = Router()
const { validator: { validateQueryDate, validatePassword, validationCallback } } = require('../../middlewares')
router.get(
  '/absenteeism',
  [validateQueryDate, validationCallback],
  employeeController.getAbsenteeism
  // #swagger.tags = ['Employee']
  // #swagger.description = 'Get absenteeism employee today'
)
router.get(
  '/', employeeController.getEmployee
  // #swagger.tags = ['Employee']
  // #swagger.description = 'Get personal data'
)

router.patch(
  '/:id', [validatePassword, validationCallback], employeeController.putEmployee
  // #swagger.tags = ['Employee']
  // #swagger.description = 'Update personal data'
)
router.put(
  '/:id/unlocked', employeeController.unlockedAccount
  // #swagger.tags = ['Employee']
  // #swagger.description = 'Unlocked account'
)

module.exports = router
