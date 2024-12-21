const passport = require("passport");
const bcrypt = require('bcryptjs');
const prisma = require('../prisma/prismaClient');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

// JWT Options
const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
}

passport.use(
    new JwtStrategy(options, async (jwtPayload, done) => {
        //use prisma query to get user with jwtPayload.id
        if (user) {
            return done(null, user)
        } else {
            return done(null, false)
        }

    })
);


module.exports = passport;