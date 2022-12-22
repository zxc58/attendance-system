const { body, validationResult } = require('express-validator')
exports.account = body('account').isLength({ min: 7, max: 14 }).isAlphanumeric()
exports.password = body('password').isLength({ min: 7, max: 14 }).isAlphanumeric()
exports.punchIn = body('punchIn').isDate()
exports.punchOut = body('punchOut').isDate()
exports.validationCallback = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ status: false, message: 'Validate fall', errors: errors.array() })
  }
  return next()
}
