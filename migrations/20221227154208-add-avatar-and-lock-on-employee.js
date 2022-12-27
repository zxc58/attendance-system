'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Employees', 'is_locked', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    })
    await queryInterface.addColumn('Employees', 'avatar', {
      type: Sequelize.STRING,
      allowNull: true
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Employees', 'is_locked')
    await queryInterface.removeColumn('Employees', 'avatar')
  }
}
