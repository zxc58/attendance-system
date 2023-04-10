const cors = require('cors')
const corsConfig = cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:4173',
    process.env.FRONTEND_URL,
  ],
  credentials: true,
  exposedHeaders: 'X-Refresh-Token',
})
module.exports = corsConfig
