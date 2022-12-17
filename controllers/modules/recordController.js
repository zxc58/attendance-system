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
    const { createdAt } = req.body
    const type = 'in'
    const record = await Record.create({ userId: id, type, createdAt })
    if (!record) { throw new Error('Punch in failed') }
    const message = 'Punch in successfully'
    return res.json({ status: true, message, record: record.toJSON() })
  } catch (error) { next(error) }
}

exports.getTodayRecord = async (req, res, next) => { // For today punch
  try {
    const { id } = req.user
    const startTime = getRevisedTime()
    const record = await Record.findOne({
      where: {
        userId: id,
        createdAt: {
          [Op.gte]: startTime.toDate()
        }
      }
    })
    if (!record) {
      const message = 'You have not punched in yet'
      return res.json({ status: true, message })
    }
    const message = 'Get today punching successfully'
    return res.json({ status: true, message, record: record.toJSON() })
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
