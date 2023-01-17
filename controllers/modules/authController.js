const httpStatus = require('http-status')
const jwt = require('jsonwebtoken')
const { Employee } = require('../../models')
const passport = require('../../config/passport')
const { signJWT } = require('../../helpers/jwtHelper')

const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET

exports.localAuthenticate = async function (req, res, next) {
  passport.authenticate(
    'local',
    { session: false },
    async (err, user, info) => {
      if (err) {
        return next(err)
      }
      if (info && !user) {
        return res.status(httpStatus.UNAUTHORIZED).json({ message: info })
      }
      if (user) {
        delete user.password
        return signJWT(res, user, true)
      }
    }
  )(req, res, next)
}

exports.refreshToken = async function (req, res, next) {
  try {
    const { refreshToken } = req.body
    if (!refreshToken) {
      const message = 'No refresh token'
      return res.status(httpStatus.BAD_REQUEST).json({ message })
    }
    const refreshTokenPayload = jwt.verify(refreshToken, refreshTokenSecret)
    if (!refreshTokenPayload) {
      const message = 'Refresh token is expired'
      return res.status(httpStatus.BAD_REQUEST).json({ message })
    }
    const { userId } = refreshTokenPayload
    const employee = await Employee.findByPk(userId, {
      attributes: { exclude: ['password', 'createdAt', 'updatedAt'] },
    })
    signJWT(res, employee.toJSON(), false)
  } catch (err) {
    next(err)
  }
}
