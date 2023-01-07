const passport = require('../../config/passport')
const { signJWT } = require('../../helpers/jwtHelper')
const httpStatus = require('http-status')
const authenticator = {
  localAuth: (req, res, next) => {
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
  jwtAuth: (req, res, next) => {
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
  },
  adminAuth: (req, res, next) => {
    const { isAdmin } = req.user
    if (isAdmin) { return next() }
    const message = 'this api is for admin'
    return res.status(httpStatus.FORBIDDEN).json({ message })
  }
}
module.exports = authenticator
