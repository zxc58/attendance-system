// @ts-check
const jwt = require('jsonwebtoken')
const accessTokenSecret =
  process.env.ACCESS_TOKEN_SECRET ?? 'ACCESS_TOKEN_SECRET'
const refreshTokenSecret =
  process.env.REFRESH_TOKEN_SECRET ?? 'REFRESH_TOKEN_SECRET'
const accessTokenMaxage = Number(process.env.ACCESS_TOKEN_MAXAGE ?? 30000)
const refreshTokenMaxage = Number(process.env.REFRESH_TOKEN_MAXAGE ?? 50000)
/**
 *
 * @param {object} res Express response object
 * @param {object} user user information
 * @param {boolean} signRefreshToken Whether sign a refresh token
 * @returns
 */
exports.signJWT = (res, user, signRefreshToken) => {
  const accessToken = jwt.sign(user, accessTokenSecret, {
    expiresIn: `${accessTokenMaxage}s`,
  })
  const responseData = { accessToken }
  if (signRefreshToken) {
    const refreshToken = jwt.sign({ userId: user.id }, refreshTokenSecret, {
      expiresIn: `${refreshTokenMaxage}s`,
    })
    responseData.refreshToken = refreshToken
  }
  return res.json({ message: 'Get jwt', ...responseData })
}
