/* eslint-disable no-unused-vars */
// Requirements
const { Op } = require('sequelize')
const { Attendance, Calendar } = require('../../models')
const { getRevisedTime } = require('../../helpers/timeHelper')
const redisClient = require('../../config/redis')
// Constants

//
exports.getRecentlRecords = async (req, res, next) => { // For recent punching
  try {
    const { id } = req.user
    const dateIds = []
    const attendances = await Attendance.findAll({
      where: {
        employeeId: id,
        dateId: {
          [Op.in]: dateIds
        }
      },
      raw: true,
      nest: true
    })
    const message = 'Get records success'
    return res.json({ status: true, message, attendances })
  } catch (error) { next(error) }
}

exports.getTodaysRecord = async (req, res, next) => { // For today punch
  try {
    const { id } = req.user
    const todayJSON = await redisClient.get('today')
    const today = JSON.parse(todayJSON)
    const dateId = today.id
    const attendance = await Attendance.findOne({
      where: {
        employeeId: id,
        dateId
      }
    })
    if (!attendance) {
      const message = 'You have not punched in yet'
      return res.json({ status: true, message })
    }
    const message = 'Get today punching successfully'
    return res.json({ status: true, message, attendance: attendance.toJSON() })
  } catch (error) { next(error) }
}

exports.postRecord = async (req, res, next) => { // For punch in
  try {
    const employeeId = req.user.id
    const { punchIn } = req.body
    const todayJSON = await redisClient.get('today')
    const today = JSON.parse(todayJSON)
    const dateId = today.id
    const attendance = await Attendance.create({ dateId, employeeId, punchIn })
    if (!attendance) { throw new Error('Punch in failed') }
    const message = 'Punch in successfully'
    return res.json({ status: true, message, record: attendance.toJSON() })
  } catch (error) { next(error) }
}

exports.putRecord = async (req, res, next) => { // For punch out
  try {
    const { id } = req.params
    const { punchOut } = req.body
    await Attendance.update({ punchOut }, { where: { id } })
    const message = 'Punch out successfully'
    return res.json({ status: true, message })
  } catch (error) { next(error) }
}
