const dayjs = require('dayjs')
const utc = require('dayjs/plugin/utc')
const timezone = require('dayjs/plugin/timezone')
const dividedHour = Number(process.env.DIVIDED_HOUR ?? 5)
const timezoneName = process.env.TIMEZONE_NAME ?? 'Asia/Taipei'
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.tz.setDefault(timezoneName)
exports.dayjs = dayjs
exports.getNowTime = () => dayjs.tz(dayjs())
exports.getRevisedDate = () =>
  dayjs.tz(dayjs()).subtract(dividedHour, 'hour').startOf('day').tz('UTC', true)

exports.getRevisedTime = () =>
  dayjs
    .tz(dayjs())
    .subtract(dividedHour, 'h')
    .startOf('d')
    .add(dividedHour, 'h')
