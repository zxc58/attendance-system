'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Attendance extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
    }
  }
  Attendance.init({
    employeeId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Employee',
        key: 'id'
      }
    },
    punchIn: DataTypes.DATE,
    punchOut: DataTypes.DATE,
    dateId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Calendar',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'Attendance',
    tableName: 'Attendances',
    underscored: true
  })
  return Attendance
}
