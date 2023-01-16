const { Router } = require('express')
const { employeeController, attendanceController } = require('../../controllers')
const router = Router()
const { validator: { bodyPassword, bodyPunchIn, bodyPunchOut, bodyEmail, queryLocation, queryDate, validationCallback } } = require('../../middlewares')
//
const multer = require('multer')
const storage = multer.memoryStorage()
const upload = multer({ storage })

router.post(
  '/:id/avatar',
  upload.single('image'),
  employeeController.updateAvatar
  // #swagger.tags = ['Employee']
  // #swagger.description = 'Update personal avatar'
)
//
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
  '/:employeeId/attendances/:attendanceId',
  [bodyPunchOut, queryLocation, validationCallback],
  attendanceController.punchOut
  /*  #swagger.tags = ['Attendance']
      #swagger.description = 'hahahaApi for employee punch out'
  */

)

module.exports = router
