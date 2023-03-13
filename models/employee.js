'use strict'
const { Model } = require('sequelize')
const bcryptjs = require('bcryptjs')
module.exports = (sequelize, DataTypes) => {
  class Employee extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Employee.hasMany(models.Attendance, { foreignKey: 'employeeId' })
      Employee.belongsTo(models.Calendar, { foreignKey: 'hireDateId' })
      Employee.belongsTo(models.Department, { foreignKey: 'departmentId' })
    }
  }
  Employee.init(
    {
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      account: DataTypes.STRING,
      password: {
        type: DataTypes.STRING,
        set(value) {
          this.setDataValue('password', bcryptjs.hashSync(value))
        },
      },
      phone: DataTypes.STRING,
      hireDateId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Calendar',
          key: 'id',
        },
      },
      isAdmin: DataTypes.BOOLEAN,
      departmentId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Department',
          key: 'id',
        },
      },
      incorrect: {
        type: DataTypes.TINYINT.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
      },
      avatar: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Employee',
      tableName: 'Employees',
      underscored: true,
    }
  )
  return Employee
}
