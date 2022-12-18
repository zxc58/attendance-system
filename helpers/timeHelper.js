const dayjs = require('dayjs')
const utc = require('dayjs/plugin/utc')
const timezone = require('dayjs/plugin/timezone') // dependent on utc plugin
dayjs.extend(utc)
dayjs.extend(timezone)
const timeZoneName = process.env.TIME_ZONE_NAME ?? 'Asia/Taipei'
const dividedHour = Number(process.env.DIVIDED_HOUR ?? 5)
/**
 *
 * @returns 現在時間的 dayjs object(台灣時區)
 */
exports.getNowTime = function () {
  return dayjs().tz(timeZoneName)
}
/**
 * 如果今天已經過了05:00，回傳今天05:00，反之回傳昨天05:00
 * @returns dayjs object (台灣時區)
 */
exports.getRevisedTime = function () {
  return dayjs().tz(timeZoneName).subtract(dividedHour, 'hour').startOf('day').add(dividedHour, 'hour')
}
