const passport = require('passport');

const isAuthenticated = (req, res, next) => {
    passport.authenticate('jwt', {session: false}, (err, user, info) => {
        if (err) {
            return res.status(500).json({error: 'Internal Server Error'})
        }

        if (!user) {
            return res.status(401).json({ error: 'Unauthorized - Invalid or missing token' })
        }

        req.user = user
        return next()
    })
}