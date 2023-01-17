/* eslint-disable camelcase */
'use strict'
const bcryptjs = require('bcryptjs')
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const queryTypes = { type: queryInterface.sequelize.QueryTypes.SELECT }
    const [dates, departments] = await Promise.all([
      queryInterface.sequelize.query(
        "SELECT id,date from Calendar where date='2022-10-12'",
        queryTypes
      ),
      queryInterface.sequelize.query(
        "SELECT id,name from Departments where name='HR'",
        queryTypes
      ),
    ])
    const [hire_date_id, department_id] = [dates[0].id, departments[0].id]
    const employees = [
      {
        name: 'Titansoft',
        account: 'titansoft',
        password: bcryptjs.hashSync('titaner'),
        hire_date_id,
        is_admin: false,
        phone: '0987654321',
        email: 'titansoft@example.com',
      },
      {
        name: 'Alphacamp',
        account: 'alphacamp',
        password: bcryptjs.hashSync('titaner'),
        hire_date_id,
        is_admin: false,
        phone: '0912345678',
        email: 'alphacamp@example.com',
      },
      {
        name: 'Titanadmin',
        account: 'admin',
        password: bcryptjs.hashSync('tiadmin'),
        hire_date_id,
        is_admin: true,
        department_id,
        phone: '0999999999',
        email: 'admin@example.com',
      },
    ]
    await queryInterface.bulkInsert('Employees', employees)
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Employees', {})
  },
}
