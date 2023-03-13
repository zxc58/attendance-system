const dividedHour = Number(process.env.DIVIDED_HOUR ?? 5)
const timeZoneName = process.env.TIME_ZONE_NAME ?? 'Asia/Taipei'
const moment = require('moment')
require('moment-timezone')
moment.tz.setDefault(timeZoneName)
exports.momentTW = moment
/**
 *
 * @returns 台灣現在時間的 moment object
 */
exports.getNowTime = function () {
  return moment()
}
/**
 * 如果台灣現在時間已經過了05:00，回傳今天05:00，反之回傳昨天05:00
 * @returns moment object
 */
exports.getRevisedTime = function () {
  return moment()
    .subtract(dividedHour, 'hour')
    .startOf('day')
    .add(dividedHour, 'hour')
}

exports.getRevisedDate = function () {
  return moment().subtract(dividedHour, 'hour').startOf('day').add(8, 'h')
}
