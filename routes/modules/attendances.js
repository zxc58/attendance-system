const { Router } = require('express')
const { attendanceController } = require('../../controllers')
const { validator: { validateLocation, validatePunchIn, validatePunchOut, validationCallback } } = require('../../middlewares')

const router = Router()
router.get(
  '/today',
  // #swagger.tags = ['Attendance']
  // #swagger.description = 'Get personal today's punching'
  attendanceController.getTodaysRecord
)

router.get(
  '/recent',
  // #swagger.tags = ['Attendance']
  // #swagger.description = 'Get personal punching recent'
  attendanceController.getRecentlRecords
)

router.post(
  '/',
  [validateLocation, validatePunchIn, validationCallback],
  // #swagger.tags = ['Record']
  // #swagger.description = 'Punch in'
  attendanceController.postRecord
)

router.put(
  '/:id',
  [validateLocation, validatePunchOut, validationCallback],
  // #swagger.tags = ['Record']
  // #swagger.description = 'Punch out'
  attendanceController.putRecord
)
module.exports = router
