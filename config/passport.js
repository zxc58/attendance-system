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
    const user = await Employee.findOne({ where: { account } })
    if (!user) { return done(null, false, 'Account do not exist') }
    if (user.isLocked) { return done(null, false, 'Wrong times over 5') }
    if (!bcryptjs.compareSync(password, user.password)) {
      const wrongTimes = await redisClient.get(`account:${account}`)
      if (+wrongTimes === 4) {
        user.isLocked = true
        await Promise.all([user.save(), redisClient.del(`account:${account}`)])
      } else {
        const newWrongTimes = wrongTimes ? +wrongTimes + 1 : 1
        await redisClient.set(`account:${account}`, newWrongTimes)
      }
      return done(null, false, 'Password wrong')
    }
    return done(null, user.toJSON())
  } catch (error) { console.error(error); done(error) }
}))
passport.use(new JwtStrategy(jwtConfig, async (jwtPayload, done) => {
  try {
    const user = await Employee.findByPk(jwtPayload.id, { logging: false })
    if (!user) { return done(new Error('jwt wrong')) }
    done(null, user.toJSON())
  } catch (error) { console.error(error); done(error) }
}))
module.exports = passport
