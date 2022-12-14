const { Calendar, Sequelize } = require('../models')
const { getRevisedTime, getNowTime, getRevisedDate } = require('./timeHelper')
const { Op } = Sequelize
const { v4: uuidv4 } = require('uuid')

async function periodFunction (redisClient) {
  const date = getRevisedDate().toDate()
  const before30Date = getRevisedDate().subtract(30, 'd').toDate()
  const punchQrId = uuidv4()
  const [today, recentDates] = await Promise.all([
    Calendar.findOne({
      where: {
        date
      },
      attributes: {
        exclude: ['createdAt', 'updatedAt']
      },
      logging: false
    }),
    Calendar.findAll({
      where: {
        date: {
          [Op.gte]: before30Date,
          [Op.lt]: date
        }
      },
      attributes: {
        exclude: ['createdAt', 'updatedAt']
      },
      raw: true,
      nest: true,
      order: [['date', 'DESC']],
      logging: false
    })
  ])
  await Promise.all([
    redisClient.set('today', JSON.stringify(today.toJSON())),
    redisClient.set('recentDates', JSON.stringify(recentDates)),
    redisClient.set('punchQrId', punchQrId)
  ])
  const expireTime = getRevisedTime().add(24, 'h').diff(getNowTime(), 's')
  setTimeout(periodFunction, expireTime * 1000, redisClient)
}
module.exports = {
  periodFunction
}
