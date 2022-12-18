'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Calendar', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      date: {
        type: Sequelize.DATEONLY
      },
      day: {
        type: Sequelize.STRING
      },
      is_holiday: {
        defaultValue: false,
        type: Sequelize.BOOLEAN
      },
      createdAt: {
        defaultValue: Sequelize.fn('now'),
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        defaultValue: Sequelize.fn('now'),
        allowNull: false,
        type: Sequelize.DATE
      }
    })
  },
  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Calendar')
  }
}
