'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const departmentNames = ['HR', 'Accounting', 'PR', 'Other']
    const departments = departmentNames.map((e) => ({ name: e }))
    const checkSeeds = await queryInterface.select(null, 'Departments', {
      where: { name: { [Sequelize.Op.in]: departmentNames } },
    })
    if (checkSeeds.length !== 0) return console.info('Already seed')
    await queryInterface.bulkInsert('Departments', departments)
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Departments', {})
  },
}
