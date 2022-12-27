'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Employee extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
    }
  }
  Employee.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    account: DataTypes.STRING,
    password: DataTypes.STRING,
    phone: DataTypes.STRING,
    hireDate: DataTypes.DATEONLY,
    isAdmin: DataTypes.BOOLEAN,
    departmentId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Department',
        key: 'id'
      }
    },
    isLocked: DataTypes.BOOLEAN,
    avatar: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Employee',
    tableName: 'Employees',
    underscored: true
  })
  return Employee
}
