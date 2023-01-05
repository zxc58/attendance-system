const { body, query, validationResult } = require('express-validator')
const geolib = require('geolib')

const companyPosition = {
  latitude: Number(process.env.COMPANY_LATITUDE),
  longitude: Number(process.env.COMPANY_LONGITUDE)
}
const distanceLimit = Number(process.env.DISTANCE_LIMIT ?? 400)
const httpStatus = require('http-status')
exports.validateAccount = body('account').isLength({ min: 7, max: 14 }).isAlphanumeric()
exports.validatePassword = body('password').isLength({ min: 7, max: 14 }).isAlphanumeric()
exports.validatePunchIn = body('punchIn').isISO8601()
exports.validatePunchOut = body('punchOut').isISO8601()
exports.validateQueryDate = query('date').custom(value => {
  if (['today'].includes(value)) { return true }
  throw new Error('Query date is invalid ')
})
exports.validateLocation = [
  query('location.latitude').toFloat(),
  query('location.longitude').toFloat(),
  query('location.accuracy').toFloat(),
  query('location').custom((value) => {
    const { accuracy, latitude, longitude } = value
    if (!accuracy || !latitude || !longitude) { throw new Error('GPS missing required data') }
    const distance = accuracy + geolib.getDistance(companyPosition, { latitude, longitude })
    if (!(+distance <= distanceLimit)) { throw new Error('Location is out of range : ' + distance) }
    return true
  })
]
exports.validationCallback = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const message = 'express-validator error'
    return res.status(httpStatus.BAD_REQUEST).json({ message, errors: errors.array() })
  }
  return next()
}
