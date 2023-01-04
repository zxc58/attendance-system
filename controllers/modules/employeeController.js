const { Employee, Attendance } = require('../../models')
const redisClient = require('../../config/redis')
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

exports.getAbsenteeism = async (req, res, next) => {
  try {
    const todayJSON = await redisClient.get('today')
    const dateId = JSON.parse(todayJSON).id
    const absenteeismEmployees = await Employee.findAll({
      include: {
        model: Attendance,
        required: false,
        where: {
          dateId
        },
        attributes: { exclude: ['createdAt', 'updatedAt'] }

      },
      attributes: { exclude: ['password', 'createdAt', 'updatedAt'] },
      raw: true,
      nest: true
    })
    const message = 'Get absenteeism employees successfully'
    return res.json({ message, absenteeismEmployees })
  } catch (err) { next(err) }
}

exports.unlockedAccount = async (req, res, next) => {
  try {
    const { id } = req.params
    const employee = await Employee.findByPk(id)
    employee.isLocked = false
    await employee.save()
    const message = 'Clear absenteeism successfully'
    return res.json({ message })
  } catch (err) { next(err) }
}
