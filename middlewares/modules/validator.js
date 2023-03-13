const { body, query, validationResult } = require('express-validator')
const geolib = require('geolib')

const companyPosition = {
  latitude: Number(process.env.COMPANY_LATITUDE),
  longitude: Number(process.env.COMPANY_LONGITUDE),
}
const distanceLimit = Number(process.env.DISTANCE_LIMIT ?? 400)
const httpStatus = require('http-status')

exports.bodyAccount = body('account')
  .isLength({ min: 5, max: 14 })
  .isAlphanumeric()
exports.bodyPassword = body('password').custom((value) => {
  if (!value) {
    return true
  }
  const isValid = /[A-Za-z0-9]{7,14}/.test(value)
  if (isValid) {
    return true
  }
  return Promise.reject(new Error('password is invalid'))
})
exports.bodyEmail = body('email').isEmail()
exports.bodyPunchIn = body('punchIn').isISO8601()
exports.bodyPunchOut = body('punchOut').isISO8601()
exports.queryDate = query('date').custom((value) => {
  if (['today', 'recent'].includes(value)) {
    return true
  }
  return Promise.reject(new Error('Query date is invalid '))
})
exports.queryLocation = [
  query('location.latitude').toFloat(),
  query('location.longitude').toFloat(),
  query('location.accuracy').toFloat(),
  query('location').custom((value) => {
    const { accuracy, latitude, longitude } = value
    if (!accuracy || !latitude || !longitude) {
      throw new Error('GPS missing required data')
    }
    const distance =
      accuracy + geolib.getDistance(companyPosition, { latitude, longitude })
    if (!(+distance <= distanceLimit)) {
      throw new Error('Location is out of range : ' + distance)
    }
    return true
  }),
]
exports.validationCallback = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(httpStatus.BAD_REQUEST).json({ message: errors.array() })
  }
  return next()
}
