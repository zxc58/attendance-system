const { Router } = require('express')
const { attendanceController } = require('../../controllers')
const { authenticator: { jwtAuthenticator } } = require('../../middlewares')
const router = Router()

router.get(
  '/unworking',
  jwtAuthenticator,
  attendanceController.unworking
  // #swagger.tags = ['Attendance']
  // #swagger.description = 'Get unworking employees'

)
router.get(
  '/qrcode',
  attendanceController.getQrcode
  // #swagger.tags = ['QR']
  // #swagger.description = 'Get qrcode value'
)
router.post(
  '/qrcode',
  jwtAuthenticator,
  attendanceController.qrPunch
  // #swagger.tags = ['QR']
  // #swagger.description = 'Api for qr punch'
)

module.exports = router
