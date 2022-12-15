const dayjs = require('dayjs')
const utc = require('dayjs/plugin/utc')
const timezone = require('dayjs/plugin/timezone') // dependent on utc plugin
dayjs.extend(utc)
dayjs.extend(timezone)
const timeZoneName = process.env.TIME_ZONE_NAME ?? 'Asia/Taipei'
const dividedHour = Number(process.env.DIVIDED_HOUR ?? 5)
exports.getNowTime = () => dayjs().tz(timeZoneName)

exports.getRevisedTime = () => {
  let revisedTime
  const now = dayjs().tz(timeZoneName)
  // console.log(dividedHour)
  if (now.hour() < dividedHour) {
    revisedTime = now.subtract(1, 'day').startOf('day').add(dividedHour, 'hour')
  } else {
    revisedTime = now.startOf('day').add(dividedHour, 'hour')
  }
  return revisedTime
}
