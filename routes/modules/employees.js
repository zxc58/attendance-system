const { Router } = require('express')
const { employeeController, attendanceController } = require('../../controllers')
const router = Router()
router.get(
  '/',
  employeeController.getEmployees
  // #swagger.tags = ['Employee']
  // #swagger.description = 'Get employees data'
)
router.get(
  '/:id',
  employeeController.getEmployee
  // #swagger.tags = ['Employee']
  // #swagger.description = 'Get personal data'
)
router.get(
  '/:id/attendances',
  employeeController.getPersonalAttendances
  // #swagger.tags = ['Attendance']
  // #swagger.description = 'Get personal attendances'
)
router.patch(
  '/:id',
  employeeController.patchEmployee
  // #swagger.tags = ['Employee']
  // #swagger.description = 'Update personal data'
)
router.post(
  '/:id/attendances',
  attendanceController.punchIn
  // #swagger.tags = ['Attendance']
  // #swagger.description = 'Api for employee punch in'
)
router.patch(
  '/:employeeId/attendances/:attendanceId',
  attendanceController.punchOut
  // #swagger.tags = ['Attendance']
  // #swagger.description = 'Api for employee punch out'
)

module.exports = router
