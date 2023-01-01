const passport = require('passport')
const jwt = require('jsonwebtoken')
const { signJWT } = require('../../helpers/jwtHelper')
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET
const authenticator = {
  localAuthenticator: (req, res, next) => {
    passport.authenticate('local', { session: false }, async (err, user, info) => {
      if (err) { return next(err) }
      if (info && !user) {
        return res.json({ status: false, message: info })
      }
      if (user) {
        delete user.password; delete user.createdAt; delete user.updatedAt
        return signJWT({ res, user })
      }
    })(req, res, next)
  },
  jwtAuthenticator: (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
      if (err) { return next(err) }
      if (!user && info) { return res.status(401).json({ message: info }) }
      req.user = user
      return next()
    })(req, res, next)
  },
  antiJwtAuthenticator: (req, res, next) => {
    if (req.get('Authorization')) { return next(new Error('Already sign in')) }
    return next()
  }
}
module.exports = authenticator
