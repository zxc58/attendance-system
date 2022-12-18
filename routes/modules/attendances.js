const { Router } = require('express')
const { attendanceController } = require('../../controllers')

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
  '/', attendanceController.postRecord
  // #swagger.tags = ['Record']
  // #swagger.description = 'Punch in'
)

router.put(
  '/:id', attendanceController.putRecord
  // #swagger.tags = ['Record']
  // #swagger.description = 'Punch out'
)

module.exports = router
