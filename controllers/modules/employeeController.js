const { Employee } = require('../../models')
const bcryptjs = require('bcryptjs')
exports.getEmployee = async (req, res, next) => {
  try {
    const id = req.user.id
    const employee = await Employee.findByPk(id, { attributes: { exclude: ['password', 'createdAt', 'updatedAt'] } })
    const message = 'Get user data successfully'
    return res.json({ message, employee: employee.toJSON() })
  } catch (error) { next(error) }
}
exports.putEmployee = async (req, res, next) => {
  try {
    const { id } = req.user
    const { password } = req.body
    const employee = await Employee.findByPk(id)
    const hash = bcryptjs.hashSync(password)
    employee.password = hash
    const newEmployee = await employee.save()
    const message = 'update password successfully'
    return res.json({ message, employee: newEmployee.toJSON() })
  } catch (error) { next(error) }
}
