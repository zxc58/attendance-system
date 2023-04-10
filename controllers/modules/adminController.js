const httpStatus = require('http-status')
const redisClient = require('../../config/redis')
const { dayjs } = require('../../helpers/timeHelper')
const { getAbsentEmployees } = require('../../helpers/sequelizeQuery')
const {
  Employee,
  Attendance,
  Department,
  Calendar,
  sequelize,
  Sequelize,
} = require('../../models')
const { gte } = Sequelize.Op
const defaultPassword = process.env.DEFAULT_PASSWORD
exports.getUnworking = async function (req, res, next) {
  try {
    const dailyCache = await redisClient.json.get('dailyCache')
    const dateId = dailyCache.today.id
    const employees = await Employee.findAll({
      where: { '$Attendances.id$': null },
      include: [
        {
          model: Attendance,
          required: false,
          where: { dateId },
          attributes: [],
        },
        { model: Department, attributes: [] },
      ],
      attributes: [
        'id',
        'name',
        'phone',
        [sequelize.col('Department.name'), 'departmentName'],
      ],
      raw: true,
      nest: true,
    })
    const message = 'Get unworking employees successfully'
    return res.json({ message, data: employees })
  } catch (err) {
    next(err)
  }
}
exports.getLocked = async function (req, res, next) {
  try {
    const employees = await Employee.findAll({
      where: { incorrect: { [gte]: 5 } },
      attributes: ['id', 'name', 'account'],
      raw: true,
      nest: true,
    })
    const message = 'Get locked users successfully'
    return res.json({ message, data: employees })
  } catch (err) {
    next(err)
  }
}
exports.unlockAccount = async function (req, res, next) {
  try {
    const { id } = req.params
    const employee = await Employee.findByPk(id)
    if (!employee) {
      const message = `Did not find employee where id=${id}`
      return res.status(httpStatus.NOT_FOUND).json({ message })
    }
    employee.incorrect = 0
    employee.password = defaultPassword
    const newEmployee = await employee.save()
    const message = 'Unlocked account,update password successfully'
    return res.json({ message, data: newEmployee.toJSON() })
  } catch (error) {
    next(error)
  }
}
exports.getAbsenteeism = async function (req, res, next) {
  try {
    const absentEmployees = await getAbsentEmployees()
    const message = 'Get error attendances successfully'
    return res.json({ message, data: absentEmployees })
  } catch (err) {
    next(err)
  }
}
exports.modifyAttendance = async function (req, res, next) {
  try {
    const { employeeId, dateId } = req.body
    const date = await Calendar.findByPk(dateId)
    if (!date)
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ message: 'Invalid value' })
    const attendance = (
      await Attendance.findOrBuild({
        where: { employeeId, dateId },
        default: { employeeId, dateId },
      })
    )[0]
    attendance.punchIn = dayjs(date.date).add(8, 'h').toDate()
    attendance.punchOut = dayjs(date.date).add(16, 'h').toDate()
    await attendance.save()
    const message = 'Modify attendance successfully'
    return res.json({ message })
  } catch (err) {
    next(err)
  }
}
