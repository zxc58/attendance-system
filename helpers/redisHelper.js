const { Calendar, Sequelize } = require('../models')
const { getRevisedTime, getNowTime, getRevisedDate } = require('./timeHelper')
const { Op } = Sequelize
const { v4: uuidv4 } = require('uuid')
async function periodFunction(redisClient) {
  const date = getRevisedDate().toDate()
  const before30Date = getRevisedDate().subtract(30, 'd').toDate()
  const punchQrId = uuidv4()
  const [today, recentDates] = await Promise.all([
    Calendar.findOne({
      where: {
        date,
      },
      attributes: {
        exclude: ['createdAt', 'updatedAt'],
      },
      logging: false,
    }),
    Calendar.findAll({
      where: {
        date: {
          [Op.gte]: before30Date,
          [Op.lte]: date,
        },
      },
      attributes: {
        exclude: ['createdAt', 'updatedAt'],
      },
      raw: true,
      nest: true,
      order: [['date', 'DESC']],
      logging: false,
    }),
  ])
  const dailyCache = {
    recentDates,
    punchQrId,
    today: today.toJSON(),
  }
  redisClient.json.set('dailyCache', '$', dailyCache)
  const expireTime = getRevisedTime().add(24, 'h').diff(getNowTime(), 's')
  setTimeout(periodFunction, expireTime * 1000, redisClient)
}
module.exports = {
  periodFunction,
}
