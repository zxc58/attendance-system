// Requirements
const { Op } = require('sequelize')
const { Record, Calendar } = require('../../models')
const { getRevisedTime } = require('../../helpers/timeHelper')
// Constants

//
exports.getRecentlRecords = async (req, res, next) => { // For recent punching
  try {
    const { id } = req.user
    const date = await Calendar.findAll({
      where: {
        date: {
          [Op.lt]: getRevisedTime().subtract(5, 'h').toDate()
        },
        isHoliday: false
      },

      limit: 7,
      order: [['date', 'DESC']],
      raw: true,
      nest: true
    })
    const dateIds = date.map(e => e.id)
    const record = await Record.findAll({
      where: {
        userId: id,
        dateId: {
          [Op.in]: dateIds
        }
      }
    })
    const message = 'Get records success'
    return res.json({ status: true, message, data: record })
  } catch (error) { next(error) }
}

exports.getTodaysRecord = async (req, res, next) => { // For today punch
  try {
    const { id } = req.user
    const startTime = getRevisedTime().subtract(5, 'h').toDate()
    const date = await Calendar.findOne({
      where: {
        date: startTime
      }
    })
    const dateId = date?.id
    const record = await Record.findOne({
      where: {
        userId: id,
        dateId
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

exports.postRecord = async (req, res, next) => { // For punch in
  try {
    const userId = req.user.id
    const { createdAt } = req.body
    const type = 'in'
    const startTime = getRevisedTime().subtract(5, 'h').toDate()
    const date = await Calendar.findOne({
      where: {
        date: startTime
      }
    })
    const dateId = date.id
    const record = await Record.create({ dateId, userId, type, createdAt })
    if (!record) { throw new Error('Punch in failed') }
    const message = 'Punch in successfully'
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
