const { body, query, validationResult, buildCheckFunction, check } = require('express-validator')
const geolib = require('geolib')
const companyPosition = process.env.COMPANY_POSITION ?? { latitude: 25.04712450557659, longitude: 121.44501747146609 }
const distanceLimit = Number(process.env.DISTANCE_LIMIT ?? 400)

exports.validateAccount = body('account').isLength({ min: 7, max: 14 }).isAlphanumeric()
exports.validatePassword = body('password').isLength({ min: 7, max: 14 }).isAlphanumeric()
exports.validatePunchIn = body('punchIn').isISO8601()
exports.validatePunchOut = body('punchOut').isISO8601()
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
  console.log(req.query)
  if (!errors.isEmpty()) {
    return res.status(400).json()
  }
  return next()
}
