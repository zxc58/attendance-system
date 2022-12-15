'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Records', 'type', {
      type: Sequelize.STRING,
      allowBull: false
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Records', 'type')
  }
}
