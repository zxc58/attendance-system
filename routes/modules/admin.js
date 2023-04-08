const { Router } = require('express')
const router = Router()
const { adminController } = require('../../controllers')
router.get(
  '/employees/unworking',
  adminController.getUnworking
  // #swagger.tags = ['Admin']
  // #swagger.description = 'Get unwork employees'
)
router.get(
  '/employees/locked',
  adminController.getLocked
  // #swagger.tags = ['Admin']
  // #swagger.description = 'Get locked accounts'
)
router.patch(
  '/employees/:id/unlock',
  adminController.unlockAccount
  // #swagger.tags = ['Admin']
  // #swagger.description = 'Unlock an account'
)
router.get(
  '/employees/absent',
  adminController.getAbsenteeism
  // #swagger.tags = ['Admin']
  // #swagger.description = 'Get absenteeism employees'
)
router.patch(
  '/attendances',
  adminController.modifyAttendance
  // #swagger.tags = ['Admin']
  // #swagger.description = 'Modify Attendance '
)
module.exports = router
