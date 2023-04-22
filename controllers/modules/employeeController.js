const httpStatus = require('http-status')
const { uploadFile } = require('../../services/imgur')
const { Employee, Attendance, Calendar, Sequelize } = require('../../models')
const redisClient = require('../../config/redis')
const { Op } = Sequelize
exports.updateAvatar = async function (req, res, next) {
  try {
    const { employeeId } = req.params
    const file = req.file
    const employee = await Employee.findByPk(employeeId, {
      attributes: { exclude: ['password', 'createdAt', 'updatedAt'] },
    })
    if (!employee) {
      const message = 'Do not found resource of this id'
      return res.status(httpStatus.BAD_REQUEST).json({ message })
    }
    const url = await uploadFile(file)
    if (!url) {
      const message = 'update avatar fail'
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message })
    }
    employee.avatar = url
    await employee.save()
    return res.json({ message: 'successfully', avatar: url })
  } catch (err) {
    next(err)
  }
}
exports.getEmployee = async function (req, res, next) {
  try {
    const { employeeId } = req.params
    const employee = await Employee.findByPk(employeeId, {
      attributes: { exclude: ['password', 'createdAt', 'updatedAt'] },
    })
    if (!employee) {
      const message = `Do not found employee ${employeeId}`
      return res.status(httpStatus.NOT_FOUND).json({ message })
    }
    const message = 'Get employee data successfully'
    return res.json({ message, employee: employee.toJSON() })
  } catch (error) {
    next(error)
  }
}
exports.patchEmployee = async function (req, res, next) {
  try {
    const { employeeId } = req.params
    const { password, phone, email } = req.body
    const employee = await Employee.findByPk(employeeId, {
      attributes: { exclude: ['createdAt', 'updatedAt'] },
    })
    if (!employee) {
      const message = `Do not found employee ${employeeId}`
      return res.status(httpStatus.NOT_FOUND).json({ message })
    }
    if (password) employee.password = password
    if (phone) employee.phone = phone
    if (email) employee.email = email
    const newEmployee = await employee.save()
    const message = 'Update password successfully'
    return res.json({ message, data: newEmployee.toJSON() })
  } catch (error) {
    next(error)
  }
}
exports.getPersonalAttendances = async function (req, res, next) {
  try {
    const { employeeId } = req.params
    const employee = await Employee.findByPk(employeeId)
    const { hireDateId } = employee
    const dailyCache = await redisClient.json.get('dailyCache')
    const dateIds = dailyCache.recentDates.map((e) => e.id)
    const attendances = await Calendar.findAll({
      where: { id: { [Op.in]: dateIds, [Op.gte]: hireDateId } },
      include: {
        model: Attendance,
        where: { employeeId },
        required: false,
        attributes: { exclude: ['updatedAt', 'createdAt'] },
      },
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      raw: true,
      nest: true,
      order: [['date', 'DESC']],
    })
    const message = 'Get records success'
    return res.json({ message, attendances })
  } catch (err) {
    next(err)
  }
}
