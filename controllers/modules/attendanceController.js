// Requirements
const httpStatus = require('http-status')
const redisClient = require('../../config/redis')
const { Attendance } = require('../../models')
exports.getQrcode = async (req, res, next) => {
  try {
    const punchQrId = await redisClient.get('punchQrId')
    return res.json({ message: 'get qr successfully', punchQrId })
  } catch (err) { next(err) }
}
exports.qrPunch = async (req, res, next) => {
  try {
    const employeeId = req.user.id
    const { punchQrId, punch } = req.body
    const [checkUuid, todayJSON] = await Promise.all([
      redisClient.get('punchQrId'),
      redisClient.get('today')
    ])
    if (!(checkUuid === punchQrId)) {
      const message = 'Id is expired'
      return res.status(httpStatus.NOT_FOUND).json({ message })
    }
    const dateId = JSON.parse(todayJSON).id
    const attendance = await Attendance.findOne({
      where: {
        dateId,
        employeeId
      }
    })
    if (attendance) {
      attendance.punchOut = punch
      await attendance.save()
    } else {
      await Attendance.create({
        employeeId,
        punchIn: punch,
        dateId
      })
    }
    const message = 'QR code punch successfully'
    return res.json({ message })
  } catch (err) { next(err) }
}
exports.punchIn = async (req, res, next) => {
  try {
    const { id: employeeId } = req.params
    const { punchIn } = req.body
    const todayJSON = await redisClient.get('today')
    const today = JSON.parse(todayJSON)
    const dateId = today.id
    const attendance = await Attendance.create({ dateId, employeeId, punchIn })
    const message = 'Punch in successfully'
    return res.json({ message, attendance: attendance.toJSON() })
  } catch (error) { next(error) }
}
exports.punchOut = async (req, res, next) => {
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
    return res.json({ message, attendance: newAttendance.toJSON() })
  } catch (error) { next(error) }
}
