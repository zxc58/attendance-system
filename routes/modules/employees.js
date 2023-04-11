const { Router } = require('express')
const {
  employeeController,
  attendanceController,
} = require('../../controllers')
const router = Router()
const { multer: upload } = require('../../middlewares')
//
router.post(
  '/avatar',
  upload.single('image'),
  employeeController.updateAvatar
  // #swagger.tags = ['Employee']
  // #swagger.description = 'Update personal avatar'
)
//
router.get(
  '/',
  employeeController.getEmployee
  // #swagger.tags = ['Employee']
  // #swagger.description = 'Get personal data'
)
router.get(
  '/attendances',
  employeeController.getPersonalAttendances
  // #swagger.tags = ['Attendance']
  // #swagger.description = 'Get personal attendances'
)
router.patch(
  '/',
  employeeController.patchEmployee
  // #swagger.tags = ['Employee']
  // #swagger.description = 'Update personal data (for text value)'
)
router.post(
  '/attendances',
  attendanceController.punchIn
  /*  #swagger.tags = ['Attendance']
      #swagger.description = 'Api for employee punch in'
      #swagger.responses[200] = {
        description: 'Punch in successfully and return record',
        schema: {
          message:'Punch in successfully',
          data:{ $ref: '#/definitions/punch_in' }
        }
    }  */
)
router.patch(
  '/attendances/:attendanceId',
  attendanceController.punchOut
  /*  #swagger.tags = ['Attendance']
      #swagger.description = 'Api for employee punch out'
  */
)
module.exports = router
