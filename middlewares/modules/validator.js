const { body, query, validationResult, buildCheckFunction, check } = require('express-validator')
const geolib = require('geolib')
const companyPosition = process.env.COMPANY_POSITION ?? { latitude: 25.04712450557659, longitude: 121.44501747146609 }
const distanceLimit = Number(process.env.DISTANCE_LIMIT ?? 400)
exports.account = body('account').isLength({ min: 7, max: 14 }).isAlphanumeric()
exports.password = body('password').isLength({ min: 7, max: 14 }).isAlphanumeric()
exports.punchIn = body('punchIn').isISO8601()
exports.punchOut = body('punchOut').isISO8601()
exports.position = body(['latitude', 'longtitude']).isLatLong()
exports.validationCallback = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json()
  }
  return next()
}
exports.distance = (req, res, next) => {
  const { location } = req.body
  if (!location?.accuracy || !location?.latitude || !location.longitude) {
    return res.status(400).json({ message: 'Location invalid' })
  }
  const distance = location.accuracy + geolib.getDistance(companyPosition, location)
  if (distance <= distanceLimit) { return next() }
  return res.status(400).json({ message: 'Location invalid' })
}
// exports.locationCheck = [query(['latitude', 'longtitude'], 'location invalid').isLatLong(),check]
