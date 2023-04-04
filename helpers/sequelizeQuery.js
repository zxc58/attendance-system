const dayjs = require('dayjs')
const redisClient = require('../config/redis')
const { Calendar, Sequelize, sequelize } = require('../models')
const { Op, QueryTypes } = Sequelize
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
exports.getAbsentEmployees = async function () {
  const dailyCache = await redisClient.json.get('dailyCache')
  const dateCondition = dayjs().subtract(3, 'month').format('YYYY-MM-DD')
  const todayId = dailyCache.today.id
  const query = `SELECT e.id as employeeId,e.name as name,c.id as dateId,c.date as date,c.day as day
,a.punch_in as punchIn ,a.punch_out as punchOut,
  TIMESTAMPDIFF(HOUR,a.punch_in,a.punch_out) as hourCount
FROM attendance.employees as e 
CROSS JOIN (select * from attendance.calendar where date>$dateCondition) as c
left join attendance.attendances as a 
on  e.id=a.employee_id and c.id=a.date_id
where c.id<$todayId and e.hire_date_id <= c.id and c.is_holiday=0
having isnull(punchOut) or isnull(hourCount) or hourCount<8
order by date desc;`
  const result = await sequelize.query(query, {
    type: QueryTypes.SELECT,
    bind: { todayId, dateCondition },
  })
  return result
}
