const httpStatus = require('http-status')
const redisClient = require('../../config/redis')
const { momentTW } = require('../../helpers/timeHelper')
const { Employee, Attendance, Department, Calendar, sequelize, Sequelize } = require('../../models')
const { or, lt, ne } = Sequelize.Op
exports.getUnworking = async (req, res, next) => {
  try {
    const todayJSON = await redisClient.get('today')
    const dateId = JSON.parse(todayJSON).id
    const employees = await Employee.findAll({
      where: {
        '$Attendances.id$': null
      },
      include: [{
        model: Attendance,
        required: false,
        where: {
          dateId
        },
        attributes: []
      }, {
        model: Department, attributes: []
      }],
      attributes: ['id', 'name', 'phone', [sequelize.col('Department.name'), 'departmentName']],
      raw: true,
      nest: true
    })
    const message = 'Get unworking employees successfully'
    return res.json({ message, employees })
  } catch (err) { next(err) }
}
exports.getLocked = async (req, res, next) => {
  try {
    const employees = await Employee.findAll({
      where: { isLocked: true },
      attributes: ['id', 'name', 'account'],
      raw: true,
      nest: true
    })
    const message = 'Get locked users successfully'
    return res.json({ message, employees })
  } catch (err) { next(err) }
}
exports.unlockAccount = async (req, res, next) => {
  try {
    const { id } = req.params
    const employee = await Employee.findByPk(id)
    if (!employee) {
      const message = `Do not found employee ${id}`
      return res.status(httpStatus.NOT_FOUND).json({ message })
    }
    employee.isLocked = false
    const newEmployee = await employee.save()
    const message = 'update password successfully'
    return res.json({ message, employee: newEmployee.toJSON() })
  } catch (error) { next(error) }
}
exports.getAbsenteeism = async (req, res, next) => {
  try {
    const date = await redisClient.get('today')
    const dateId = JSON.parse(date).id
    const attendances = await Attendance.findAll({
      where: {
        dateId: {
          [ne]: dateId
        }
      },
      include: [
        {
          model: Employee,
          attributes: []
        }, {
          model: Calendar,
          attributes: []
        }
      ],
      attributes: [
        'employeeId', 'dateId', 'punchIn', 'punchOut',
        [sequelize.col('Calendar.date'), 'date'],
        [sequelize.col('Calendar.day'), 'day'],
        [sequelize.col('Employee.name'), 'name'],
        [sequelize.col('Employee.account'), 'account'],
        [sequelize.col('Attendance.id'), 'attendanceId'],
        [sequelize.fn('TIMESTAMPDIFF', sequelize.literal('HOUR'),
          sequelize.literal('punch_in'), sequelize.literal('punch_out')), 'diff']
      ],
      having: {
        [or]: [
          {
            diff: {
              [lt]: 8
            }
          },
          { punchOut: null }
        ]
      },
      raw: true,
      nest: true
    })
    const message = 'Get error attendances successfully'
    return res.json({ message, attendances })
  } catch (err) { next(err) }
}
exports.modifyAttendance = async (req, res, next) => {
  try {
    const { id } = req.params
    const attendance = await Attendance.findByPk(id, { include: { model: Calendar } })
    if (!attendance) {
      const message = `Do not found attendance ${id} `
      return res.status(httpStatus.NOT_FOUND).json({ message })
    }
    const date = attendance.Calendar.date
    const newPunchIn = momentTW(date).add(8, 'h').toDate()
    const newPunchOut = momentTW(date).add(16, 'h').toDate()
    attendance.punchIn = newPunchIn
    attendance.punchOut = newPunchOut
    const newAttendance = await attendance.save()
    const message = 'Modify attendance successfully'
    return res.json({ message })
  } catch (err) { next(err) }
}
