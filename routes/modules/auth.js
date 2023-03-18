// @ts-check
const { Router } = require('express')
const middlewares = require('../../middlewares')
const { authenticator } = middlewares
const { jwtAuth } = authenticator
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
router.get('/logout', authController.signout)
router.get('/verify', jwtAuth, authController.verifyJWT)
module.exports = router
