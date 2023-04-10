// @ts-check
const jwt = require('jsonwebtoken')
const { v4: uuid } = require('uuid')
const accessTokenSecret =
  process.env.ACCESS_TOKEN_SECRET ?? 'ACCESS_TOKEN_SECRET'
const accessTokenMaxage = Number(process.env.ACCESS_TOKEN_MAXAGE ?? 30000)
/**
 *
 * @param {object} employee employee information
 * @returns {{accessToken:string,refreshToken:string}}
 */
exports.signJWT = function (employee) {
  const payload = {
    employeeId: employee.id,
    role: employee.isAdmin ? 'admin' : 'employee',
  }
  const accessToken = jwt.sign(payload, accessTokenSecret, {
    expiresIn: `${accessTokenMaxage}s`,
  })
  return { accessToken, refreshToken: uuid() }
}
exports.sendJWT = function (res, jwt, message = 'Send JWT') {
  res.cookie('refresh_token', jwt.refreshToken, {
    httpOnly: true,
    sameSite: 'none',
    secure: true,
    signed: true,
  })
  res.json({ message, data: { accessToken: jwt.accessToken } })
}
