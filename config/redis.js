const redis = require('redis')
const redisClient = redis.createClient({
  url: process.env.REDIS_CONNECT_STRING ?? 'redis://localhost:6379'
})
redisClient.on('connect', () => {
  console.log('Redis client connected')
})
redisClient.on('error', () => { console.error('redis on error') })
redisClient.connect()
module.exports = redisClient
