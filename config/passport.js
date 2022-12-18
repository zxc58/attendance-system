// Requirements
const passport = require('passport')
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt')
const LocalStrategy = require('passport-local')
const bcryptjs = require('bcryptjs')
const redisClient = require('./redis')
const { Employee } = require('../models')
// Constants
const jwtConfig = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
}
// Register strategy
passport.use(new LocalStrategy({ usernameField: 'account' }, async (account, password, done) => {
  try {
    const wrongTimes = await redisClient.get(`account:${account}`)
    if (+wrongTimes === 5) { return done(null, false, 'wrong times over 5') }
    const user = await Employee.findOne({ where: { account } })
    if (!user) { return done(null, false, 'account do not exist') }
    if (!bcryptjs.compareSync(password, user.password)) {
      const newWrongTimes = wrongTimes ? +wrongTimes + 1 : 1
      redisClient.set(`account:${account}`, newWrongTimes)
      return done(null, false, { message: 'password wrong' })
    }
    return done(null, user.toJSON())
  } catch (error) { console.error(error); done(error) }
}))
passport.use(new JwtStrategy(jwtConfig, async (jwtPayload, done) => {
  try {
    const user = await Employee.findByPk(jwtPayload.id)
    if (!user) { return done(new Error('jwt wrong')) }
    done(null, user.toJSON())
  } catch (error) { console.error(error); done(error) }
}))
module.exports = passport
