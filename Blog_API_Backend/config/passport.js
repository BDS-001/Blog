const passport = require("passport");
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const userQueries = require('../prisma/queries/userQueries')

// JWT Options
const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
    algorithms: ['HS256'],
    ignoreExpiration: false, 
}

passport.use(
    new JwtStrategy(options, async (jwtPayload, done) => {
        try {
            const user = await userQueries.getUserById(jwtPayload.id);
            if (user) {
              return done(null, user);
            } else {
              return done(null, false);
            }
          } catch (error) {
            return done(error, false);
          }
    })
);


module.exports = passport;