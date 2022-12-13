/* eslint-disable no-unused-vars */
// Requirements
const dayjs = require('dayjs')
const utc = require('dayjs/plugin/utc')
const timezone = require('dayjs/plugin/timezone')
const { Op } = require('sequelize')
const { Record } = require('../../models')
const { getRevisedTime } = require('../../helpers/timeHelper')
// Constants
const dividedHour = process.env.DIVIDED_TIME

//
dayjs.extend(utc)
dayjs.extend(timezone)
//
exports.getOnesAllRecord = async (req, res, next) => {
  try {
    const { id } = req.user
    const record = await Record.findAll({ where: { userId: id } })
    const message = 'Get record success'
    return res.json({ status: true, message, data: record })
  } catch (error) { next(error) }
}
exports.postRecord = async (req, res, next) => {
  try {
    const { id } = req.user
    await Record.create({ userId: id })
    const message = 'Punching successfully'
    return res.json({ status: true, message })
  } catch (error) { next(error) }
}
exports.getOnesPunching = async (req, res, next) => {
  try {
    const { id } = req.user
    const startTime = getRevisedTime()
    const records = await Record.findAll({
      where: {
        id,
        punchingTime: {
          [Op.gte]: startTime.toDate()
        }
      },
      raw: true,
      nest: true
    })
    const message = 'Get punching successfully'
    return res.json({ status: true, message, data: records })
  } catch (error) { next(error) }
}
