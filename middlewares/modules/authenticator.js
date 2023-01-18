const passport = require('../../config/passport')
const httpStatus = require('http-status')
const authenticator = {
  jwtAuth: (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
      if (err) {
        return next(err)
      }
      if (!user && info) {
        return res.status(httpStatus.UNAUTHORIZED).json({ message: info })
      }
      req.user = user
      return next()
    })(req, res, next)
  },
  antiJwtAuthenticator: (req, res, next) => {
    if (req.get('Authorization')) {
      return next(new Error('Already sign in'))
    }
    return next()
  },
  adminAuth: (req, res, next) => {
    const { isAdmin } = req.user
    if (isAdmin) {
      return next()
    }
    const message = 'this api is for admin'
    return res.status(httpStatus.FORBIDDEN).json({ message })
  },
}
module.exports = authenticator
