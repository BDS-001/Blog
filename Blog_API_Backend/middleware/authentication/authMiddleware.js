const passport = require('passport');

function isAuthenticated(requiredPermissions = []) {
    return (req, res, next) => {
      passport.authenticate('jwt', { session: false }, (err, user, info) => {
        if (err) {
            console.error('Authentication error:', err);
            return next(err);
        }
  
        if (!user) {
            return res.status(401).json({ error: 'Unauthorized - Invalid or missing token' });
        }

        if (user.role.isAdmin) {
          req.user = user;
          return next();
        }
  
        const hasPermissions = requiredPermissions.every(permission => {
            return user.role[permission] === true;
        });
  
        if (requiredPermissions.length > 0 && !hasPermissions) {
            return res.status(403).json({ error: 'Forbidden - Insufficient permissions' });
        }
  
        req.user = user;
        next();
      })(req, res, next); 
    };
  }
  
  module.exports = { isAuthenticated };