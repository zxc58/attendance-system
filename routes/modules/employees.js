const { Router } = require('express')
const {
  employeeController,
  attendanceController,
} = require('../../controllers')
const router = Router()
const {
  multer: upload,
  validator: {
    bodyPassword,
    bodyPunchIn,
    bodyPunchOut,
    bodyEmail,
    queryLocation,
    queryDate,
    validationCallback,
  },
} = require('../../middlewares')
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
  [queryDate, validationCallback],
  employeeController.getPersonalAttendances
  // #swagger.tags = ['Attendance']
  // #swagger.description = 'Get personal attendances'
)
router.patch(
  '/',
  [bodyEmail, bodyPassword, validationCallback],
  employeeController.patchEmployee
  // #swagger.tags = ['Employee']
  // #swagger.description = 'Update personal data (for text value)'
)
router.post(
  '/attendances',
  [bodyPunchIn, queryLocation, validationCallback],
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
  [bodyPunchOut, queryLocation, validationCallback],
  attendanceController.punchOut
  /*  #swagger.tags = ['Attendance']
      #swagger.description = 'hahahaApi for employee punch out'
  */
)
module.exports = router
