const httpStatus = require('http-status')
const AWS = require('aws-sdk')
const short = require('short-uuid')
const { Employee, Attendance, Calendar, Sequelize } = require('../../models')
const redisClient = require('../../config/redis')
const { Op } = Sequelize

const accessKeyId = process.env.AWS_IAM_ACCESS_KEY_ID
const secretAccessKey = process.env.AWS_IAM_SECRET_ACCESS_KEY
const s3 = new AWS.S3({ accessKeyId, secretAccessKey })

exports.updateAvatar = async function (req, res, next) {
  try {
    const { id } = req.params
    const employee = await Employee.findByPk(id, {
      attributes: { exclude: ['password', 'createdAt', 'updatedAt'] },
    })
    if (!employee) {
      const message = 'Do not found resource of this id'
      return res.status(httpStatus.BAD_REQUEST).json({ message })
    }
    const params = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: short.generate(),
      Body: req.file.buffer,
      ACL: 'public-read',
      ContentType: req.file.mimetype,
    }
    s3.upload(params, async function (err, data) {
      try {
        if (err) {
          const message = 'update avatar fail'
          return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message })
        }
        employee.avatar = data.Location
        await employee.save()
        return res.json({ message: 'successfully', avatar: data.Location })
      } catch (err) {
        const message = 'Update avatar fail'
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message })
      }
    })
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
      const todayJSON = await redisClient.get('today')
      const today = JSON.parse(todayJSON)
      const dateId = today.id
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
      const recentDates = await redisClient.get('recentDates')
      const dateIds = JSON.parse(recentDates).map((e) => e.id)
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
