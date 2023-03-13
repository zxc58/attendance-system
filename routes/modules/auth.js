// @ts-check
const { Router } = require('express')
const { authController } = require('../../controllers')
/**
 * @type {Router}
 */
const router = Router()

router.post(
  '/login',
  authController.localAuthenticate
  // #swagger.tags = ['Auth']
  // #swagger.description = 'Api for sign in'
)
router.post(
  '/refresh',
  authController.refreshToken
  // #swagger.tags = ['Auth']
  // #swagger.description = 'Api for refresh access token'
)

module.exports = router
