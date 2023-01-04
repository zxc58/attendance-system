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
  // #swagger.tags = ['Attendance']
  // #swagger.description = 'Punch in'
  attendanceController.postRecord
)

router.patch(
  '/:id',
  [validateLocation, validatePunchOut, validationCallback],
  attendanceController.putRecord
  // #swagger.tags = ['Attendance']
  // #swagger.description = 'Punch out'
)

router.put(
  '/',
  attendanceController.clearAbsenteeism
  // #swagger.tags = ['Attendance']
  // #swagger.description = 'For clear absenteeism'
)
module.exports = router
