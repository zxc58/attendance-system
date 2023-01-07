const { Router } = require('express')
const router = Router()
const { adminController } = require('../../controllers')
router.get(
  '/unworking',
  adminController.getUnworking
  // #swagger.tags = ['Admin']
  // #swagger.description = 'Get unwork employees'
)
router.get(
  '/locked',
  adminController.getLocked
  // #swagger.tags = ['Admin']
  // #swagger.description = 'Get locked accounts'
)
router.patch(
  '/unlock',
  adminController.unlockAccount
  // #swagger.tags = ['Admin']
  // #swagger.description = 'Unlock an account'
)
router.get(
  '/absenteeism',
  adminController.getAbsenteeism
  // #swagger.tags = ['Admin']
  // #swagger.description = 'get absenteeism employees'
)
router.patch(
  '/attendances/:id',
  adminController.modifyAttendance
  // #swagger.tags = ['Admin']
  // #swagger.description = 'modify Attendance '
)
module.exports = router
