const passport = require('passport');

function isAuthenticated(requiredPermissions = []) {
    return (req, res, next) => {
        passport.authenticate('jwt', {session: false}, (err, user, info) => {
            if (err) {
                return res.status(500).json({error: 'Internal Server Error'})
            }

            if (!user) {
                return res.status(401).json({ error: 'Unauthorized - Invalid or missing token' })
            }

            const hasPermissions = requiredPermissions.every(permission => {
                user.role[permission] === true
            })

            if (requiredPermissions.length > 0 && !hasPermissions) {
                return res.status(403).json({ 
                error: 'Forbidden - Insufficient permissions' 
                });
            }

            req.user = user;
            return next();
        })
    }
}

module.exports = {isAuthenticated}