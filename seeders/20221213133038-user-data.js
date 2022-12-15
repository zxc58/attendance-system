'use strict'
const bcryptjs = require('bcryptjs')
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const seed = [
      {
        name: 'boss',
        role: 'user',
        account: 'boss',
        password: bcryptjs.hashSync('titaner'),
        wrong_times: 0,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'accountant',
        role: 'user',
        account: 'accountant',
        password: bcryptjs.hashSync('titaner'),
        wrong_times: 0,
        created_at: new Date(),
        updated_at: new Date()
      }
    ]
    await queryInterface.bulkInsert('Users', seed)
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', {})
  }
}
