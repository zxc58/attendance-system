// Requirements
const { Op } = require('sequelize')
const { Record } = require('../../models')
const { getRevisedTime } = require('../../helpers/timeHelper')
// Constants

//
exports.getRecentlRecords = async (req, res, next) => { // For recent punching
  try {
    const { id } = req.user
    const record = await Record.findAll({ where: { userId: id } })
    const message = 'Get records success'
    return res.json({ status: true, message, data: record })
  } catch (error) { next(error) }
}

exports.postRecord = async (req, res, next) => { // For punch in
  try {
    const { id } = req.user
    const type = 'in'
    await Record.create({ userId: id, type })
    const message = 'Punch in successfully'
    return res.json({ status: true, message })
  } catch (error) { next(error) }
}

exports.getTodayRecord = async (req, res, next) => { // For today punch
  try {
    const { id } = req.user
    const startTime = getRevisedTime()
    // console.log(startTime.toDate())
    const records = await Record.findOne({
      where: {
        id,
        createdAt: {
          [Op.gte]: startTime.toDate()
        }
      }
    })

    const message = 'Get today punching successfully'
    return res.json({ status: true, message, data: records.toJSON() })
  } catch (error) { next(error) }
}

exports.putRecord = async (req, res, next) => { // For punch out
  try {
    const { id } = req.params
    const { workingHour } = req.body
    await Record.update({ workingHour, type: 'out' }, { where: { id } })
    const message = 'Punch out successfully'
    return res.json({ status: true, message })
  } catch (error) { next(error) }
}
