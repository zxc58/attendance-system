const { Employee, Attendance, Calendar, Sequelize } = require('../../models')
const { Op } = Sequelize
const redisClient = require('../../config/redis')
const httpStatus = require('http-status')
const AWS = require('aws-sdk')
const short = require('short-uuid')

short.generate()
const s3 = new AWS.S3({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_KEY_ID
})

exports.updateAvatar = async (req, res, next) => {
  try {
    const { id } = req.params
    const params = {
      Bucket: 'titaner/user-image',
      Key: short.generate(),
      Body: req.file.buffer,
      ACL: 'public-read',
      ContentType: req.file.mimetype
    }
    s3.upload(params, async function (err, data) {
      if (err) { return res.json({ message: 'update avatar fail' }) }
      console.log('Bucket Created Successfully', data.Location)
      const employee = await Employee.findByPk(id)
      employee.avatar = data.Location
      const newEmployee = await employee.save()
      return res.json({ message: 'successfully', avatar: data.Location })
    })
  } catch (err) { next(err) }
}
exports.getEmployee = async (req, res, next) => {
  try {
    const { id } = req.params
    const employee = await Employee.findByPk(id, { attributes: { exclude: ['password', 'createdAt', 'updatedAt'] } })
    if (!employee) {
      const message = `Do not found employee ${id}`
      return res.status(httpStatus.NOT_FOUND).json({ message })
    }
    const message = 'Get employee data successfully'
    return res.json({ message, employee: employee.toJSON() })
  } catch (error) { next(error) }
}
exports.patchEmployee = async (req, res, next) => {
  try {
    const { id } = req.params
    const { password, phone, email } = req.body
    const newData = {}
    if (password) { newData.password = password }
    if (phone) { newData.phone = phone }
    if (email) { newData.email = email }
    const employee = await Employee.findByPk(id)
    if (!employee) {
      const message = `Do not found employee ${id}`
      return res.status(httpStatus.NOT_FOUND).json({ message })
    }
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
    const { hireDateId } = req.user
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
        return res.json({ message, attendances: null })
      }
      const message = 'Get today punching successfully'
      return res.json({ message, attendances: attendance.toJSON() })
    } else if (date === 'recent') {
      const recentDates = await redisClient.get('recentDates')
      const dateIds = JSON.parse(recentDates).map(e => e.id)
      const attendances = await Calendar.findAll({
        where: {
          id: {
            [Op.in]: dateIds,
            [Op.gte]: hireDateId
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
    } else {
      const message = 'Bad query params'
      return res.status(httpStatus.BAD_REQUEST).json({ message })
    }
  } catch (err) { next(err) }
}
