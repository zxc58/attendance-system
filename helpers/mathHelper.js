/**
 *
 * @param {*} position1 An object includes latitude and longitude
 * @param {*} position2 An object includes latitude and longitude
 * 此function已經棄用
 * @returns Distance of 2 places (unit meter)
 */
exports.distance = function (position1, position2) {
  const [lat1, long1] = [Number(position1.latitude), Number(position1.longitude)]
  const [lat2, long2] = [Number(position2.latitude), Number(position2.longitude)]

  if ((lat1 === lat2) && (long1 === long2)) {
    return 0
  } else {
    const radlat1 = Math.PI * lat1 / 180
    const radlat2 = Math.PI * lat2 / 180
    const theta = long1 - long2
    const radtheta = Math.PI * theta / 180
    let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta)
    if (dist > 1) {
      dist = 1
    }
    dist = Math.acos(dist)
    dist = dist * 180 / Math.PI
    dist = dist * 60 * 1.1515

    return dist * 1.609344 * 1000
  }
}
