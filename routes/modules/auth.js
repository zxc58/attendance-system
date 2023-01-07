const { Router } = require('express')
const httpStatus = require('http-status')
const jwt = require('jsonwebtoken')
const { Employee } = require('../../models')
const { signJWT } = require('../../helpers/jwtHelper')
const { authenticator: { localAuth } } = require('../../middlewares')
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET
const router = Router()
router.post(
  '/login',
  localAuth
  // #swagger.tags = ['Auth']
  // #swagger.description = 'Api for sign in'
)
router.post(
  '/refresh',
  async (req, res) => {
    const { refreshToken } = req.body
    if (!refreshToken) { return res.status(httpStatus.BAD_REQUEST).json({ message: 'No refresh token' }) }
    const refreshTokenPayload = jwt.verify(refreshToken, refreshTokenSecret)
    if (!refreshTokenPayload) { return res.status(httpStatus.BAD_REQUEST).json({ message: 'Refresh token is expired' }) }
    const { userId: id } = refreshTokenPayload
    const employee = await Employee.findByPk(id, { attributes: { exclude: ['password', 'createdAt', 'updatedAt'] } })
    signJWT({ res, user: employee, getRefreshToken: false })
  }
  // #swagger.tags = ['Auth']
  // #swagger.description = 'Api for refresh access token'
)

module.exports = router
