const { User } = require('../../models')
exports.getUser = async (req, res, next) => {
  try {
    const { id } = req.params
    const user = await User.findByPk(id)
    const message = 'get user data successfully'
    return res.json({ status: true, message, user: user.toJSON() })
  } catch (error) { next(error) }
}
exports.putUser = async (req, res, next) => {
  try {
    const { id } = req.user
    const { password } = req.body
    await User.update({ password }, { where: { id } })
    const message = 'update password successfully'
    return res.json({ status: true, message })
  } catch (error) { next(error) }
}
