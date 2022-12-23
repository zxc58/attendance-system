const passport = require('passport')
const jwt = require('jsonwebtoken')
const authenticator = {
  localAuthenticator: (req, res, next) => {
    passport.authenticate('local', { session: false }, async (err, user, info) => {
      if (err) { return next(err) }
      if (info && !user) {
        return res.json({ status: false, message: info })
      }
      if (user) {
        const id = user.id
        const token = jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' })
        return res.json({ status: true, message: 'Get jwt token', token })
      }
    })(req, res, next)
  },
  jwtAuthenticator: (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
      if (err) { return next(err) }
      if (!user) { return res.status(401).json({ status: false, message: 'Wrong error' }) }
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
