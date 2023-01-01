const jwt = require('jsonwebtoken')
const { momentTW } = require('./timeHelper')
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET

exports.signJWT = ({ res, user, getRefreshToken }) => {
  const accessToken = jwt.sign({ user, type: 'access_token' }, accessTokenSecret, { expiresIn: '1m' })
  const accessTokenExpiredTime = momentTW().add(50, 's').toDate()
  const responseData = { accessToken, accessTokenExpiredTime }
  if (getRefreshToken) {
    const refreshToken = jwt.sign({ type: 'refresh_token', userId: user.id }, refreshTokenSecret, { expiresIn: '1d' })
    responseData.refreshToken = refreshToken
  }
  return res.json({ message: 'Get jwt', ...responseData })
}
