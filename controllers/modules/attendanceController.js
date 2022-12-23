/* eslint-disable no-unused-vars */
// Requirements
const { Op } = require('sequelize')
const { Attendance, Calendar } = require('../../models')
const { getRevisedTime } = require('../../helpers/timeHelper')
const { distance } = require('../../helpers/mathHelper')
const redisClient = require('../../config/redis')
// Constants
const homePosition = { latitude: 25.04712450557659, longitude: 121.44501747146609 }
//
exports.getRecentlRecords = async (req, res, next) => { // For recent punching
  try {
    const { id: employeeId } = req.user
    const recentDates = await redisClient.get('recentDates')
    const dateIds = JSON.parse(recentDates).map(e => e.id)
    if (!employeeId || !dateIds) { throw new Error('controller cannot get necessary vars') }
    const attendances = await Calendar.findAll({
      where: {
        id: {
          [Op.in]: dateIds
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
    // console.log('attendances')
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
      return res.json({ status: true, message, attendance: null })
    }
    const message = 'Get today punching successfully'
    return res.json({ status: true, message, attendance: attendance.toJSON() })
  } catch (error) { next(error) }
}

exports.postRecord = async (req, res, next) => { // For punch in
  try {
    const employeeId = req.user.id
    const { punchIn, latitude, longitude } = req.body
    const twoPlacesDistance = distance(homePosition, { latitude, longitude })
    console.log(twoPlacesDistance)
    const todayJSON = await redisClient.get('today')
    const today = JSON.parse(todayJSON)
    const dateId = today.id
    const attendance = await Attendance.create({ dateId, employeeId, punchIn })
    if (!attendance) { throw new Error('Punch in failed') }
    const message = 'Punch in successfully'
    return res.json({ status: true, message, attendance: attendance.toJSON() })
  } catch (error) { next(error) }
}

exports.putRecord = async (req, res, next) => { // For punch out
  try {
    const { id } = req.params
    const { punchOut, latitude, longitude } = req.body
    const twoPlacesDistance = distance(homePosition, { latitude, longitude })
    console.log(twoPlacesDistance)
    if (!id || !punchOut) { throw new Error('Lack neccessary vars') }
    const attendance = await Attendance.findByPk(id)
    if (!attendance) { throw new Error('req.params.id is wrong') }
    attendance.punchOut = punchOut
    const returning = await attendance.save()
    const message = 'Punch out successfully'
    return res.json({ status: true, message, attendance: returning.toJSON() })
  } catch (error) { next(error) }
}
