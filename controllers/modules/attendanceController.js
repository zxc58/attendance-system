const httpStatus = require('http-status')
const redisClient = require('../../config/redis')
const { Attendance } = require('../../models')

exports.getQrcode = async function (req, res, next) {
  try {
    const dailyCache = await redisClient.json.get('dailyCache')

    const punchQrId = dailyCache.punchQrId
    return res.json({ message: 'get qr successfully', punchQrId })
  } catch (err) {
    next(err)
  }
}

exports.qrPunch = async function (req, res, next) {
  try {
    const employeeId = req.user.id
    const { punchQrId, punch } = req.body
    const dailyCache = await redisClient.json.get('dailyCache')

    if (!(dailyCache.punchQrId === punchQrId)) {
      const message = 'Id is expired'
      return res.status(httpStatus.NOT_FOUND).json({ message })
    }
    const dateId = dailyCache.today.id
    const attendance = await Attendance.findOne({
      where: {
        dateId,
        employeeId,
      },
    })
    if (attendance) {
      attendance.punchOut = punch
      await attendance.save()
    } else {
      await Attendance.create({
        employeeId,
        punchIn: punch,
        dateId,
      })
    }
    const message = 'QR code punch successfully'
    return res.json({ message })
  } catch (err) {
    next(err)
  }
}

exports.punchIn = async function (req, res, next) {
  try {
    const { id: employeeId } = req.params
    const { punchIn } = req.body
    const dailyCache = await redisClient.json.get('dailyCache')
    const dateId = dailyCache.today.id
    const attendance = await Attendance.create(
      { dateId, employeeId, punchIn },
      { attributes: { exclude: ['createdAt', 'updatedAt'] } }
    )
    const message = 'Punch in successfully'
    return res.json({ message, data: attendance.toJSON() })
  } catch (error) {
    next(error)
  }
}

exports.punchOut = async function (req, res, next) {
  try {
    const { attendanceId } = req.params
    const { punchOut } = req.body
    const attendance = await Attendance.findByPk(attendanceId)
    if (!attendance) {
      const message = `Do not found attendance ${attendanceId}`
      return res.status(httpStatus.NOT_FOUND).json({ message })
    }
    attendance.punchOut = punchOut
    const newAttendance = await attendance.save()
    const message = 'Punch out successfully'
    return res.json({ message, data: newAttendance.toJSON() })
  } catch (error) {
    next(error)
  }
}
