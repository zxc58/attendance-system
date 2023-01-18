const redis = require('redis')
const { periodFunction } = require('../helpers/redisHelper')
const url = process.env.REDIS_CONNECT_STRING ?? 'redis://localhost:6379'
const redisClient = redis.createClient({ url })
redisClient.on('connect', () => {
  periodFunction(redisClient)
})
redisClient.on('error', () => {
  console.error('redis on error')
})

module.exports = redisClient
