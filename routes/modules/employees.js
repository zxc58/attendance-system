const { Router } = require('express')
const { employeeController, attendanceController } = require('../../controllers')
const router = Router()
const { validator: { bodyPassword, bodyPunchIn, bodyPunchOut, bodyEmail, queryLocation, queryDate, validationCallback } } = require('../../middlewares')
router.get(
  '/:id',
  employeeController.getEmployee
  // #swagger.tags = ['Employee']
  // #swagger.description = 'Get personal data'
)
router.get(
  '/:id/attendances',
  [queryDate, validationCallback],
  employeeController.getPersonalAttendances
  // #swagger.tags = ['Attendance']
  // #swagger.description = 'Get personal attendances'
)
router.patch(
  '/:id',
  [bodyEmail, bodyPassword, validationCallback],
  employeeController.patchEmployee
  // #swagger.tags = ['Employee']
  // #swagger.description = 'Update personal data'
)
router.post(
  '/:id/attendances',
  [bodyPunchIn, queryLocation, validationCallback],
  attendanceController.punchIn
  // #swagger.tags = ['Attendance']
  // #swagger.description = 'Api for employee punch in'
)
router.patch(
  '/:employeeId/attendances/:attendanceId',
  [bodyPunchOut, queryLocation, validationCallback],
  attendanceController.punchOut
  // #swagger.tags = ['Attendance']
  // #swagger.description = 'Api for employee punch out'
)

module.exports = router
