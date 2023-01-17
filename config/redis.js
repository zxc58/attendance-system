const redis = require('redis')
const { periodFunction } = require('../helpers/redisHelper')
const redisClient = redis.createClient({
  url: process.env.REDIS_CONNECT_STRING ?? 'redis://localhost:6379',
})
redisClient.on('connect', () => {
  periodFunction(redisClient)
})
redisClient.on('error', () => {
  console.error('redis on error')
})

module.exports = redisClient
