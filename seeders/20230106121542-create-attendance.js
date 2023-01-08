'use strict'
const moment = require('moment')
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const queryTypes = { type: queryInterface.sequelize.QueryTypes.SELECT }
    const workingdays = await queryInterface.sequelize.query(
      'SELECT id as dateId,date,is_holiday from Calendar ' +
      "where date>='2022-10-12' AND date< CURDATE() and is_holiday=0",
      queryTypes
    )
    const employees = await queryInterface.sequelize.query(
      'SELECT id as employeeId from Employees ' +
      "where name in ('Titansoft','Alphacamp','Titanadmin')",
      queryTypes
    )
    const attendances = []
    employees.forEach(e => {
      workingdays.forEach(d => {
        attendances.push({
          employee_id: e.employeeId,
          date_id: d.dateId,
          punch_in: moment(d.date).add(16, 'h').toDate(),
          punch_out: moment(d.date).add(24, 'h').toDate()
        })
      })
    })
    await queryInterface.bulkInsert('Attendances', attendances)
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Attendances', {})
  }
}
