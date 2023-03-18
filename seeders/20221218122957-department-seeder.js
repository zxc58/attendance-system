'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const departments = ['HR', 'Accounting', 'PR', 'Other'].map((e) => ({
      name: e,
    }))
    await queryInterface.bulkInsert('Departments', departments)
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Departments', {})
  },
}
