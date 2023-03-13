// Requirements
const passport = require('passport')
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt')
const LocalStrategy = require('passport-local')
const bcryptjs = require('bcryptjs')
const { Employee } = require('../models')
const { momentTW } = require('../helpers/timeHelper')
const sendMail = require('../helpers/emailHelper')
// Constants
const jwtConfig = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.ACCESS_TOKEN_SECRET,
}
// Register strategy
passport.use(
  new LocalStrategy(
    { usernameField: 'account' },
    async (account, password, done) => {
      try {
        const user = await Employee.findOne(
          { where: { account } },
          { attributes: { exclude: ['createdAt', 'updatedAt'] } }
        )
        if (!user) {
          return done(null, null, 'Account does not exist')
        }
        if (user.incorrect >= 5) {
          return done(null, null, 'Wrong times over 5')
        }
        if (!bcryptjs.compareSync(password, user.password)) {
          if (user.incorrect === 4) sendMail(user.toJSON())
          await user.increment('incorrect')
          return done(null, null, 'Password wrong')
        }
        return done(null, user.toJSON())
      } catch (error) {
        console.error(error)
        done(error)
      }
    }
  )
)

passport.use(
  new JwtStrategy(jwtConfig, async (accessTokenPayload, done) => {
    try {
      const { user, exp } = accessTokenPayload
      const isExpired = momentTW().isAfter(momentTW(exp * 1000))
      if (isExpired) {
        return done(null, null, 'Access is expired')
      }

      return done(null, user)
    } catch (error) {
      console.error(error)
      done(error)
    }
  })
)

module.exports = passport
