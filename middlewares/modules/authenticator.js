const passport = require('../../config/passport')
const { signJWT } = require('../../helpers/jwtHelper')
const httpStatus = require('http-status')
const authenticator = {
  localAuthenticator: (req, res, next) => {
    passport.authenticate('local', { session: false }, async (err, user, info) => {
      if (err) { return next(err) }
      if (info && !user) {
        return res.status(httpStatus.UNAUTHORIZED).json({ message: info })
      }
      if (user) {
        delete user.password; delete user.createdAt; delete user.updatedAt
        return signJWT({ res, user, getRefreshToken: true })
      }
    })(req, res, next)
  },
  jwtAuthenticator: (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
      if (err) { return next(err) }
      if (!user && info) { return res.status(httpStatus.UNAUTHORIZED).json({ message: info }) }
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
