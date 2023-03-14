const httpStatus = require('http-status')
const dayjs = require('dayjs')
const { Token } = require('../../models')
const passport = require('../../config/passport')
const { signJWT, sendJWT } = require('../../helpers/jwtHelper')
const refreshTokenMaxage = Number(process.env.REFRESH_TOKEN_MAXAGE ?? 50000)
exports.localAuthenticate = async function (req, res, next) {
  passport.authenticate(
    'local',
    { session: false },
    async (err, user, info) => {
      if (err) return next(err)
      if (info && !user)
        return res.status(httpStatus.UNAUTHORIZED).json({ message: info })
      if (user) {
        const jwt = signJWT(user)

        await Token.create({
          token: jwt.refreshToken,
          ip: req.ip ?? '',
          employeeId: user.id,
          expiredAt: dayjs().add(refreshTokenMaxage, 'day').toDate(),
        })
        return sendJWT(res, jwt, 'Sign in successfully, return access token')
      }
    }
  )(req, res, next)
}

exports.refreshToken = async function (req, res, next) {
  try {
    const { refresh_token: refreshToken } = req.signedCookies
    if (!refreshToken) {
      const message = 'No refresh token'
      return res.status(httpStatus.BAD_REQUEST).json({ message })
    }
    const token = Token.findOne({
      where: {
        token: refreshToken,
      },
    })
    if (!token)
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ message: 'Invalid refresh token' })

    if (dayjs().isAfter(token.expiredAt))
      return res
        .status(httpStatus.UNAUTHORIZED)
        .json({ message: 'Token is expired' })

    const employee = await token.getEmployee()
    const jwt = signJWT(employee.toJSON())
    await token.update({
      token: jwt.refreshToken,
      expiredAt: dayjs().add(refreshTokenMaxage, 'day').toDate(),
    })
    return sendJWT(res, jwt, 'refresh JWT successfully')
  } catch (err) {
    next(err)
  }
}

exports.signout = async function (req, res, next) {
  try {
    const { refresh_token: refreshToken } = req.signedCookies
    await Token.destroy({
      where: {
        token: refreshToken,
      },
    })
    res.cookie('refresh_token', '', {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      signed: true,
      expires: dayjs().subtract(1, 'day').toDate(),
    })
    const message = 'Sign out successfully'
    return res.json({ message })
  } catch (err) {
    next(err)
  }
}
