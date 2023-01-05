/* eslint-disable camelcase */
'use strict'
const bcryptjs = require('bcryptjs')
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const queryTypes = { type: queryInterface.sequelize.QueryTypes.SELECT }
    const [dates, departments] = await Promise.all([
      queryInterface.sequelize.query(
        "SELECT id,date from titansoft.calendar where date='2023-01-01'"
        , queryTypes
      ),
      queryInterface.sequelize.query(
        "SELECT id,name from titansoft.departments where name='HR'"
        , queryTypes
      )
    ])
    const [hire_date_id, department_id] = [dates[0].id, departments[0].id]
    const employees = [
      {
        name: 'Titansoft',
        account: 'titansoft',
        password: bcryptjs.hashSync('titaner'),
        hire_date_id,
        is_admin: false
      },
      {
        name: 'Alphacamp',
        account: 'alphacamp',
        password: bcryptjs.hashSync('titaner'),
        hire_date_id,
        is_admin: false
      },
      {
        name: 'Titanadmin',
        account: 'admin',
        password: bcryptjs.hashSync('tiadmin'),
        hire_date_id,
        is_admin: true,
        department_id
      }
    ]
    await queryInterface.bulkInsert('Employees', employees)
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Employees', {})
  }
}
