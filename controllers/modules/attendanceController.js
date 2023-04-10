const httpStatus = require('http-status')
const redisClient = require('../../config/redis')
const { Attendance } = require('../../models')
const { dayjs } = require('../../helpers/timeHelper')
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
    const { employeeId } = req.employee
    const { punchQrId } = req.body
    const punch = dayjs().startOf('minute').toDate()
    const dailyCache = await redisClient.json.get('dailyCache')
    if (dailyCache.punchQrId !== punchQrId)
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ message: 'Id is expired or invalid' })
    const dateId = dailyCache.today.id
    const attendance = await Attendance.findOne({
      where: { dateId, employeeId },
    })
    if (attendance) {
      attendance.punchOut = punch
      await attendance.save()
    } else {
      await Attendance.create({ employeeId, punchIn: punch, dateId })
    }
    const message = 'QR code punch successfully'
    return res.json({ message })
  } catch (err) {
    next(err)
  }
}
exports.punchIn = async function (req, res, next) {
  try {
    const { employeeId } = req.params
    const dailyCache = await redisClient.json.get('dailyCache')
    const checkCondition = { dateId: dailyCache.today.id, employeeId }
    const [attendance, isJustCreated] = await Attendance.findOrCreate({
      where: checkCondition,
      defaults: {
        ...checkCondition,
        punchIn: dayjs().startOf('minute').toDate(),
      },
    })
    if (!isJustCreated)
      return res
        .status(httpStatus.CONFLICT)
        .json({ message: "You've already punched in." })
    const data = attendance.toJSON()
    delete data.createdAt
    delete data.updatedAt
    data.punchOut = null
    const message = 'Punch in successfully'
    return res.json({ message, data })
  } catch (error) {
    next(error)
  }
}
exports.punchOut = async function (req, res, next) {
  try {
    const { attendanceId } = req.params
    const attendance = await Attendance.findByPk(attendanceId)
    if (!attendance) {
      const message = `Do not found attendance ${attendanceId}`
      return res.status(httpStatus.NOT_FOUND).json({ message })
    }
    attendance.punchOut = dayjs().startOf('minute').toDate()
    const newAttendance = await attendance.save()
    const message = 'Punch out successfully'
    return res.json({ message, data: newAttendance.toJSON() })
  } catch (error) {
    next(error)
  }
}
