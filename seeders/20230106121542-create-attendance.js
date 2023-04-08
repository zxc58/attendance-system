'use strict'
const dayjs = require('dayjs')
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const workingdays = await queryInterface.select(null, 'Calendar', {
      where: {
        is_holiday: false,
        date: {
          [Sequelize.Op.between]: [
            dayjs('2022-10-12').toDate(),
            dayjs().subtract(10, 'd').toDate(),
          ],
        },
      },
    })
    const employees = await queryInterface.select(null, 'Employees', {
      where: {
        account: { [Sequelize.Op.in]: ['titansoft', 'alphacamp', 'admin'] },
      },
    })
    const checkSeeds = await queryInterface.select(null, 'Attendances', {
      where: {
        employee_id: { [Sequelize.Op.in]: employees.map((e) => e.id) },
        date_id: { [Sequelize.Op.in]: workingdays.map((e) => e.id) },
      },
      plain: true,
    })
    if (checkSeeds) return console.info('Already seed')
    const attendances = []
    employees.forEach((e) => {
      workingdays.forEach((d) => {
        attendances.push({
          employee_id: e.id,
          date_id: d.id,
          punch_in: dayjs(d.date).add(16, 'h').toDate(),
          punch_out: dayjs(d.date).add(24, 'h').toDate(),
        })
      })
    })
    await queryInterface.bulkInsert('Attendances', attendances)
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Attendances', {})
  },
}
