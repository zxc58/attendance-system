const morgan = require('morgan')
const morganConfig = morgan(':method, :url, :date')
module.exports = morganConfig
