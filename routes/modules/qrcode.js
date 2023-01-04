const { Router } = require('express')
const { qrcodeController } = require('../../controllers')
const { validator: { validateLocation, validationCallback }, authenticator: { jwtAuthenticator } } = require('../../middlewares')
const router = Router()

router.get(
  '/',
  [validateLocation, validationCallback],
  qrcodeController.getQrcode
  // #swagger.tags = ['Qrcode']
  // #swagger.description = 'Get a token for qrcode punch'
)

router.post(
  '/punch',
  jwtAuthenticator,
  qrcodeController.qrPunch
  // #swagger.tags = ['Qrcode']
  // #swagger.description = 'Qrcode punch'
)
module.exports = router
