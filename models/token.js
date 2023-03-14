'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Token extends Model {
    static associate(models) {
      Token.belongsTo(models.Employee, { foreignKey: 'employeeId' })
    }
  }
  Token.init(
    {
      employeeId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Employee',
          key: 'id',
        },
      },
      token: DataTypes.STRING,
      expiredAt: DataTypes.DATE,
      ip: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Token',
      tableName: 'Tokens',
      underscored: true,
      paranoid: true,
    }
  )
  return Token
}
