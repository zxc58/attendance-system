/* eslint-disable camelcase */
'use strict'
const bcryptjs = require('bcryptjs')
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const accounts = ['titansoft', 'alphacamp', 'admin']
    const a = await queryInterface.select(null, 'Employees', {
      where: { account: { [Sequelize.Op.in]: accounts } },
    })
    if (a.length !== 0) return console.info('Already seed')
    const [dates, departments] = await Promise.all([
      queryInterface.select(null, 'Calendar', {
        where: { date: '2022-10-12' },
      }),
      queryInterface.select(null, 'Departments', { where: { name: 'HR' } }),
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
