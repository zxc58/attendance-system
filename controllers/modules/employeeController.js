const httpStatus = require('http-status')
const { uploadFile } = require('../../services/imgur')
const { Employee, Attendance, Calendar, Sequelize } = require('../../models')
const redisClient = require('../../config/redis')
const { Op } = Sequelize
exports.updateAvatar = async function (req, res, next) {
  try {
    const { id } = req.params
    const file = req.file
    const employee = await Employee.findByPk(id, {
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
    const { id } = req.params
    const employee = await Employee.findByPk(id, {
      attributes: { exclude: ['password', 'createdAt', 'updatedAt'] },
    })
    if (!employee) {
      const message = `Do not found employee ${id}`
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
    const { id } = req.params
    const { password, phone, email } = req.body
    const newData = {}
    if (password) {
      newData.password = password
    }
    if (phone) {
      newData.phone = phone
    }
    if (email) {
      newData.email = email
    }
    const employee = await Employee.findByPk(id)
    if (!employee) {
      const message = `Do not found employee ${id}`
      return res.status(httpStatus.NOT_FOUND).json({ message })
    }
    employee.set(newData)
    const newEmployee = await employee.save()
    const message = 'update password successfully'
    return res.json({ message, employee: newEmployee.toJSON() })
  } catch (error) {
    next(error)
  }
}
exports.getPersonalAttendances = async function (req, res, next) {
  try {
    const { id: employeeId } = req.params
    const { date } = req.query
    const { hireDateId } = req.user
    if (date === 'today') {
      const dailyCache = await redisClient.json.get('dailyCache')
      const dateId = dailyCache.today.id
      const attendance = await Attendance.findOne({
        where: {
          employeeId,
          dateId,
        },
        attributes: { exclude: ['createdAt', `updatedAt`] },
      })
      if (!attendance) {
        const message = 'You have not punched in yet'
        return res.json({ message, attendances: null })
      }
      const message = 'Get today punching successfully'
      return res.json({ message, attendances: attendance.toJSON() })
    } else if (date === 'recent') {
      const dailyCache = await redisClient.json.get('dailyCache')
      const dateIds = dailyCache.recentDates.map((e) => e.id)
      const attendances = await Calendar.findAll({
        where: {
          id: {
            [Op.in]: dateIds,
            [Op.gte]: hireDateId,
          },
        },
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
    } else {
      const message = 'Bad query params'
      return res.status(httpStatus.BAD_REQUEST).json({ message })
    }
  } catch (err) {
    next(err)
  }
}
