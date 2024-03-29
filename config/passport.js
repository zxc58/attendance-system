// Requirements
const passport = require('passport')
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt')
const LocalStrategy = require('passport-local')
const { Employee } = require('../models')
const sendMail = require('../services/email')
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
        const employee = await Employee.findOne(
          { where: { account } },
          { attributes: { exclude: ['createdAt', 'updatedAt'] } }
        )
        if (!employee) {
          return done(null, null, 'Account does not exist')
        }
        if (employee.incorrect >= 5) {
          return done(null, null, 'Wrong times over 5')
        }
        if (!employee.comparePassword(password)) {
          if (employee.incorrect === 4) sendMail(employee.toJSON())
          await employee.increment('incorrect')
          return done(null, null, 'Password wrong')
        }
        return done(null, employee.toJSON())
      } catch (error) {
        console.error(error)
        done(error)
      }
    }
  )
)
passport.use(
  new JwtStrategy(jwtConfig, (accessTokenPayload, done) => {
    try {
      const { employeeId, role } = accessTokenPayload
      if (!employeeId || !role) throw new Error('Access token invalid')
      return done(null, { employeeId, role })
    } catch (error) {
      console.error(error)
      done(error)
    }
  })
)
module.exports = passport
