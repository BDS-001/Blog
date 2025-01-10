const validationResult = require('express-validator');
const blogValidators = require('./validators/blogValidators');
const userValidators = require('./validators/userValidators');
const commentValidators = require('./validators/commentValidators');


const validators = {
  blog: blogValidators,
  user: userValidators,
  comment: commentValidators
};

function validateRequest(resource, operation) {
    return [
      // Get all validations rules
      ...(validators[resource][operation] || []),
      
      // Check validation results
      (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({
            message: 'Validation error',
            errors: errors.array()
          });
        }
        next();
      }
    ];
  }

module.exports = validateRequest