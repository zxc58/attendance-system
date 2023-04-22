const geolib = require('geolib')
const httpStatus = require('http-status')
const { body, query, param, validationResult } = require('express-validator')
const companyPosition = {
  latitude: Number(process.env.COMPANY_LATITUDE),
  longitude: Number(process.env.COMPANY_LONGITUDE),
}
const distanceLimit = Number(process.env.DISTANCE_LIMIT ?? 400)
exports.paramEmployeeId = param('employeeId').notEmpty().isNumeric()

exports.bodyValidator = {
  email: body('email').isEmail(),
  account: body('account').isAlphanumeric().isLength({ min: 5, max: 14 }),
  password: body('password').isAlphanumeric().isLength({ min: 7, max: 14 }),
  phone: body('phone').isLength({ max: 20 }).trim(),
}

exports.queryLocation = [
  query('location.latitude').toFloat(),
  query('location.longitude').toFloat(),
  query('location.accuracy').toFloat(),
  query('location').custom((value) => {
    const { accuracy, latitude, longitude } = value
    if (!accuracy || !latitude || !longitude)
      throw new Error('GPS missing required data')
    const distance =
      accuracy + geolib.getDistance(companyPosition, { latitude, longitude })
    if (!(+distance <= distanceLimit))
      throw new Error('Location is out of range : ' + distance)
    return true
  }),
]
exports.validationCallback = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty())
    return res.status(httpStatus.BAD_REQUEST).json({ errors: errors.array() })
  return next()
}
