const { Router } = require('express')
const { qrcodeController } = require('../../controllers')
const { validator: { distance }, authenticator: { jwtAuthenticator } } = require('../../middlewares')
const router = Router()
router.get('/',
// #swagger.tags = ['Qrcode']
// #swagger.description = 'Get a token for qrcode punch'
  qrcodeController.getQrcode)

router.post('/punch', jwtAuthenticator, qrcodeController.qrPunch)
module.exports = router
