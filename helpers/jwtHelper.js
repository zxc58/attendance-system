const jwt = require('jsonwebtoken')
const { momentTW } = require('./timeHelper')
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET
const accessTokenMaxage = Number(process.env.ACCESS_TOKEN_MAXAGE ?? 30000)
const refreshTokenMaxage = Number(process.env.REFRESH_TOKEN_MAXAGE ?? 50000)
exports.signJWT = ({ res, user, getRefreshToken }) => {
  const accessToken = jwt.sign(
    { user, type: 'access_token' },
    accessTokenSecret,
    { expiresIn: `${accessTokenMaxage}s` }
  )
  const accessTokenExpiredTime = momentTW().add(accessTokenMaxage - 10, 's').toDate()
  const responseData = { userId: user.id, accessToken, accessTokenExpiredTime }
  if (getRefreshToken) {
    const refreshToken = jwt.sign(
      { type: 'refresh_token', userId: user.id },
      refreshTokenSecret,
      { expiresIn: `${refreshTokenMaxage}s` }
    )
    responseData.refreshToken = refreshToken
  }
  return res.json({ message: 'Get jwt', ...responseData })
}
