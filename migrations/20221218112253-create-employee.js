'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Employees', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      email: {
        unique: true,
        type: Sequelize.STRING
      },
      account: {
        unique: true,
        allowNull: false,
        type: Sequelize.STRING
      },
      password: {
        allowNull: false,
        type: Sequelize.STRING
      },
      phone: {
        type: Sequelize.STRING
      },
      hire_date: {
        defaultValue: Sequelize.fn('now'),
        type: Sequelize.DATEONLY
      },
      is_admin: {
        defaultValue: false,
        type: Sequelize.BOOLEAN
      },
      department_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Departments',
          key: 'id'
        }
      },
      created_at: {
        defaultValue: Sequelize.fn('now'),
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        defaultValue: Sequelize.fn('now'),
        allowNull: false,
        type: Sequelize.DATE
      }
    })
  },
  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Employees')
  }
}
