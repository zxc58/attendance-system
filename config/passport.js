// Requirements
const passport = require('passport')
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt')
const LocalStrategy = require('passport-local')
const bcryptjs = require('bcryptjs')
const { User } = require('../models')
// Constants
const jwtConfig = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
}
// Register strategy
passport.use(new LocalStrategy({ usernameField: 'account' }, async (account, password, done) => {
  try {
    const user = await User.findOne({ where: { account } })
    if (!user) { return done(null, false, 'account do not exist') }
    if (user.wrongTimes >= 5) { return done(null, false, 'wrong times over 5') }
    if (!bcryptjs.compareSync(password, user.password)) {
      user.wrongTimes++
      await user.save()
      return done(null, false, { message: 'password wrong' })
    }
    return done(null, user.toJSON())
  } catch (error) { console.error(error); done(error) }
}))
passport.use(new JwtStrategy(jwtConfig, async (jwtPayload, done) => {
  try {
    const user = await User.findByPk(jwtPayload.id)
    if (!user) { return done(new Error('jwt wrong')) }
    done(null, user.toJSON())
  } catch (error) { console.error(error); done(error) }
}))
module.exports = passport
