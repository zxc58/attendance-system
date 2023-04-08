'use strict'
const calendar2022 = require('./seed/calendar2022.json')
const calendar2023 = require('./seed/calendar2023.json')
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    calendar2022.forEach((e) => (e.date = new Date(e.date)))
    calendar2023.forEach((e) => (e.date = new Date(e.date)))
    const checkSeeds = await queryInterface.select(null, 'Calendar')
    if (checkSeeds.length !== 0) return console.info('Already seed')
    await queryInterface.bulkInsert('Calendar', [
      ...calendar2022,
      ...calendar2023,
    ])
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Calendar', {})
  },
}
