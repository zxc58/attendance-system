const { Calendar, Sequelize } = require('../models')
const { getRevisedTime, getNowTime, getRevisedDate } = require('./timeHelper')
const { Op } = Sequelize
async function periodFunction (redisClient) {
  const date = getRevisedDate().toDate()
  const before7Date = getRevisedDate().subtract(7, 'd').toDate()
  console.log(date)
  console.log(before7Date)
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
          [Op.gte]: before7Date,
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
  console.log(today.toJSON())
  console.log(recentDates)
  await Promise.all([
    redisClient.set('today', JSON.stringify(today.toJSON())),
    redisClient.set('recentDates', JSON.stringify(recentDates))
  ])
  const expireTime = getRevisedTime().add(24, 'h').diff(getNowTime(), 's')
  setTimeout(periodFunction, expireTime * 1000, redisClient)
}
module.exports = {
  periodFunction
}
