const { Router } = require('express')
const { attendanceController } = require('../../controllers')
const { validator: { distance, punchIn, punchOut, validationCallback } } = require('../../middlewares')

const router = Router()
router.get(
  '/today', attendanceController.getTodaysRecord
  // #swagger.tags = ['Attendance']
  // #swagger.description = 'Get personal today's punching'
)

router.get(
  '/recent', attendanceController.getRecentlRecords
  // #swagger.tags = ['Attendance']
  // #swagger.description = 'Get personal punching recent'
)

router.post(
  '/', [distance, punchIn, validationCallback], attendanceController.postRecord
  // #swagger.tags = ['Record']
  // #swagger.description = 'Punch in'
)

router.put(
  '/:id', [distance, punchOut, validationCallback], attendanceController.putRecord
  // #swagger.tags = ['Record']
  // #swagger.description = 'Punch out'
)

module.exports = router
