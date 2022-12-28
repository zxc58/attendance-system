const { IS_READ_ONLY } = require('@redis/search/dist/commands/AGGREGATE')
const qrcode = require('qrcode')
const { v4: uuidv4 } = require('uuid')
const redisClient = require('../../config/redis')
const { Employee, Attendance } = require('../../models')
exports.getQrcode = async (req, res, next) => {
  try {
    const uuid = uuidv4()
    await redisClient.get(uuid, uuid, { EX: 60 })
    return res.json({ status: true, message: 'get qr successfully', uuid })
  } catch (err) { next(err) }
}
exports.qrPunch = async (req, res, next) => {
  try {
    const employeeId = req.user.id
    const { uuid, punch } = req.body
    const [checkUuid, todayJSON] = await Promise.all([
      redisClient.get(uuid),
      redisClient.get('today')
    ])
    if (!checkUuid) {
      const message = 'Uuid is expired'
      return res.json({ status: false, message })
    }

    const dateId = JSON.parse(todayJSON)
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
      await attendance.create({
        employeeId,
        punchIn: punch,
        dateId
      })
    }
    redisClient.del(uuid)
    const message = 'QR code punch successfully'
    return res.json({ status: false, message })
  } catch (err) { next(err) }
}
