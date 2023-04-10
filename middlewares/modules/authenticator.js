const passport = require('../../config/passport')
const httpStatus = require('http-status')
const authenticator = {
  jwtAuth(req, res, next) {
    passport.authenticate('jwt', { session: false }, (err, employee, info) => {
      if (err) return next(err)
      if (!employee && info)
        return res.status(httpStatus.UNAUTHORIZED).json({ message: info })
      req.employee = employee
      return next()
    })(req, res, next)
  },
  antiJwtAuthenticator(req, res, next) {
    if (req.get('Authorization')) return next(new Error('Already sign in'))
    return next()
  },
  adminAuth(req, res, next) {
    const { role } = req.employee
    if (role === 'admin') return next()
    const message = 'this api is for admin'
    return res.status(httpStatus.FORBIDDEN).json({ message })
  },
  authEmployeeId(req, res, next) {
    return req.params.employeeId === req.employee.employeeId
      ? next()
      : res.status(httpStatus.FORBIDDEN).json({
          message:
            'You do not have the permission to call this API,please check your parameters',
        })
  },
}
module.exports = authenticator
