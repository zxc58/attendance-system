const redisClient = require('../config/redis')
const { Calendar, Sequelize } = require('../models')
const { Op } = Sequelize
exports.getSomeoneAttendance = async function (employee) {
  const dailyCache = await redisClient.json.get('dailyCache')
  const dateIds = dailyCache.recentDates.map((e) => e.id)
  const attendances = await Calendar.findAll({
    where: {
      id: {
        [Op.in]: dateIds,
        [Op.gte]: employee.hireDateId,
      },
    },
    include: {
      association: Calendar.associations.Attendances,
      where: { employeeId: employee.id },
      required: false,
      attributes: { exclude: ['updatedAt', 'createdAt'] },
    },
    attributes: { exclude: ['createdAt', 'updatedAt'] },
    raw: true,
    nest: true,
    order: [['date', 'DESC']],
  })
  return attendances
}
