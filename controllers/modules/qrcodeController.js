const redisClient = require('../../config/redis')
const { Attendance } = require('../../models')
const httpStatus = require('http-status')
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
