'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Calendar extends Model {
    static associate (models) {
      Calendar.hasMany(models.Attendance, { foreignKey: 'dateId' })
    }
  }
  Calendar.init({
    date: DataTypes.DATEONLY,
    day: DataTypes.STRING,
    isHoliday: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Calendar',
    tableName: 'Calendar',
    underscored: true
  })
  return Calendar
}
