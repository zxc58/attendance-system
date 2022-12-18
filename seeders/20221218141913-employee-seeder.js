'use strict'
const bcryptjs = require('bcryptjs')
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const employees = [
      {
        name: 'Titansoft',
        account: 'titansoft',
        password: bcryptjs.hashSync('titaner')
      },
      {
        name: 'Alphacamp',
        account: 'alphacamp',
        password: bcryptjs.hashSync('titaner')
      }
    ]
    await queryInterface.bulkInsert('Employees', employees)
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Employees', {})
  }
}
