const dayjs = require('dayjs')
const utc = require('dayjs/plugin/utc')
const timezone = require('dayjs/plugin/timezone') // dependent on utc plugin
dayjs.extend(utc)
dayjs.extend(timezone)
const timeZoneName = process.env.TIME_ZONE_NAME ?? 'Asia/Taipei'

exports.getNowTime = () => dayjs().tz(timeZoneName)

exports.getRevisedTime = () => {
  let revisedTime
  const now = dayjs().tz(timeZoneName)
  if (now.hour() < 5) {
    revisedTime = now.subtract(1, 'day').startOf('day').add(5, 'hour')
  } else {
    revisedTime = now.startOf('day').add(5, 'hour')
  }
  return revisedTime
}
