const { Router } = require('express')
const { qrcodeController } = require('../../controllers')
const { validator: { validateLocation, validationCallback }, authenticator: { jwtAuthenticator } } = require('../../middlewares')
const router = Router()
router.get('/',
  [validateLocation, validationCallback],
  // #swagger.tags = ['Qrcode']
  // #swagger.description = 'Get a token for qrcode punch'
  qrcodeController.getQrcode)

router.post('/punch', jwtAuthenticator, qrcodeController.qrPunch)
module.exports = router
