const { Employee, Attendance, Calendar, Sequelize } = require('../../models')
const { Op } = Sequelize
const bcryptjs = require('bcryptjs')
const redisClient = require('../../config/redis')
const httpStatus = require('http-status')

exports.getEmployee = async (req, res, next) => {
  try {
    const { id } = req.params
    const employee = await Employee.findByPk(id, { attributes: { exclude: ['password', 'createdAt', 'updatedAt'] } })
    const message = 'Get employee data successfully'
    return res.json({ message, employee: employee.toJSON() })
  } catch (error) { next(error) }
}
exports.patchEmployee = async (req, res, next) => {
  try {
    const { id } = req.params
    const newData = { ...req.body }
    const employee = await Employee.findByPk(id)
    const hash = bcryptjs.hashSync(newData.password)
    newData.password = hash
    employee.set(newData)
    const newEmployee = await employee.save()
    const message = 'update password successfully'
    return res.json({ message, employee: newEmployee.toJSON() })
  } catch (error) { next(error) }
}
exports.getPersonalAttendances = async (req, res, next) => {
  try {
    const { id: employeeId } = req.params
    const { date } = req.query
    if (date === 'today') {
      const todayJSON = await redisClient.get('today')
      const today = JSON.parse(todayJSON)
      const dateId = today.id
      const attendance = await Attendance.findOne({
        where: {
          employeeId,
          dateId
        }
      })
      if (!attendance) {
        const message = 'You have not punched in yet'
        return res.status(httpStatus.NOT_FOUND).json({ message })
      }
      const message = 'Get today punching successfully'
      return res.json({ message, attendances: attendance.toJSON() })
    } else if (date === 'recent') {
      const recentDates = await redisClient.get('recentDates')
      const dateIds = JSON.parse(recentDates).map(e => e.id)
      const attendances = await Calendar.findAll({
        where: {
          id: {
            [Op.in]: dateIds
          }
        },
        include: {
          model: Attendance,
          where: { employeeId },
          required: false,
          attributes: { exclude: ['updatedAt', 'createdAt'] }
        },
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        raw: true,
        nest: true,
        order: [['date', 'DESC']]
      })
      const message = 'Get records success'
      return res.json({ message, attendances })
    }
  } catch (err) { next(err) }
}
