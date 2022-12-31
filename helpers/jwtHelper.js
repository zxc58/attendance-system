const jwt = require('jsonwebtoken')
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET

exports.signJWT = ({ res, user }) => {
  const accessToken = jwt.sign({ user, type: 'access_token' }, accessTokenSecret, { expiresIn: '2h' })
  const newRefreshToken = jwt.sign({ type: 'refresh_token', userId: user.id }, refreshTokenSecret)
  res.cookie('refresh_token', newRefreshToken, { httpOnly: true, signed: true })
  return res.json({ message: 'Get jwt', accessToken })
}
