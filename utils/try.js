exports.syncTry = function (r, ...params) {
  try {
    return [null, r(...params)]
  } catch (err) {
    return [err]
  }
}
