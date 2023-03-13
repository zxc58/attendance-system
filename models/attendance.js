'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Attendance extends Model {
    static associate(models) {
      Attendance.belongsTo(models.Calendar, { foreignKey: 'dateId' })
      Attendance.belongsTo(models.Employee, { foreignKey: 'employeeId' })
    }
  }
  Attendance.init(
    {
      employeeId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Employee',
          key: 'id',
        },
      },
      punchIn: DataTypes.DATE,
      punchOut: DataTypes.DATE,
      dateId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Calendar',
          key: 'id',
        },
      },
    },
    {
      sequelize,
      modelName: 'Attendance',
      tableName: 'Attendances',
      underscored: true,
    }
  )
  return Attendance
}
