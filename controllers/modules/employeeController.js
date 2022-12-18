const { Employee } = require('../../models')
exports.getEmployee = async (req, res, next) => {
  try {
    const id = req.user.id
    const user = await Employee.findByPk(id)
    const message = 'Get user data successfully'
    return res.json({ status: true, message, user: user.toJSON() })
  } catch (error) { next(error) }
}
exports.putEmployee = async (req, res, next) => {
  try {
    const { id } = req.user
    const { password } = req.body
    await Employee.update({ password }, { where: { id } })
    const message = 'update password successfully'
    return res.json({ status: true, message })
  } catch (error) { next(error) }
}
