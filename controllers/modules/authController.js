const httpStatus = require('http-status')
const dayjs = require('dayjs')
const sequelizeQuery = require('../../helpers/sequelizeQuery')
const { Token } = require('../../models')
const passport = require('../../config/passport')
const cookiesConfig = require('../../config/cookies')
const { signJWT } = require('../../helpers/jwtHelper')
const refreshTokenMaxage = Number(process.env.REFRESH_TOKEN_MAXAGE ?? 50000)
exports.localAuthenticate = async function (req, res, next) {
  passport.authenticate(
    'local',
    { session: false },
    async (err, user, info) => {
      if (err) return next(err)
      if (info && !user)
        return res
          .header('X-Refresh-Token', 'false')
          .status(httpStatus.UNAUTHORIZED)
          .json({ message: info })
      if (user) {
        const jwt = signJWT(user)
        const [attendances] = await Promise.all([
          sequelizeQuery.getSomeoneAttendance(user),
          Token.create({
            token: jwt.refreshToken,
            ip: req.ip ?? '',
            employeeId: user.id,
            expiredAt: dayjs().add(refreshTokenMaxage, 'second').toDate(),
          }),
        ])
        res.cookie(
          'refresh_token',
          jwt.refreshToken,
          cookiesConfig.refreshToken
        )
        res.json({
          message: 'Sign in successfully',
          data: { accessToken: jwt.accessToken, user, attendances },
        })
      }
    }
  )(req, res, next)
}
exports.refreshToken = async function (req, res, next) {
  try {
    const { refresh_token: refreshToken } = req.signedCookies
    if (!refreshToken)
      return res
        .status(httpStatus.UNAUTHORIZED)
        .header('X-Refresh-Token', 'false')
        .json({ message: 'No refresh token' })
    const token = await Token.findOne({
      where: {
        token: refreshToken,
      },
    })
    if (!token)
      return res
        .status(httpStatus.UNAUTHORIZED)
        .header('X-Refresh-Token', 'false')
        .json({ message: 'Invalid refresh token' })
    if (dayjs().isAfter(token.expiredAt))
      return res
        .header('X-Refresh-Token', 'false')
        .status(httpStatus.UNAUTHORIZED)
        .json({ message: 'Token is expired' })
    const employee = await token.getEmployee()
    const jwt = signJWT(employee.toJSON())
    await token.update({
      token: jwt.refreshToken,
      expiredAt: dayjs().add(refreshTokenMaxage, 'second').toDate(),
    })
    res.cookie('refresh_token', jwt.refreshToken, cookiesConfig.refreshToken)
    const message = 'Refresh JWT successfully'
    res.json({ message, data: { accessToken: jwt.accessToken } })
  } catch (err) {
    next(err)
  }
}
exports.signout = async function (req, res, next) {
  try {
    const { refresh_token: refreshToken } = req.signedCookies
    await Token.destroy({ where: { token: refreshToken } })
    res.clearCookie('refresh_token')
    const message = 'Sign out successfully'
    return res.json({ message })
  } catch (err) {
    next(err)
  }
}
exports.verifyJWT = async function (req, res, next) {
  try {
    const user = req.user
    const attendances = await sequelizeQuery.getSomeoneAttendance(user)
    return res.json({ data: { attendances, user } })
  } catch (error) {
    next(error)
  }
}
