const { Router } = require('express')
const { attendanceController } = require('../../controllers')
const {
  authenticator: { jwtAuth },
  validator: { queryLocation, validationCallback },
} = require('../../middlewares')
const router = Router()

router.get(
  '/qrcode',
  [queryLocation, validationCallback],
  attendanceController.getQrcode
  // #swagger.tags = ['QR']
  // #swagger.description = 'Get qrcode value'
)
router.post(
  '/qrcode',
  jwtAuth,
  attendanceController.qrPunch
  // #swagger.tags = ['QR']
  // #swagger.description = 'Api for qr punch'
)

module.exports = router
