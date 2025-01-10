const { validationResult } = require('express-validator');
const blogValidators = require('./blogValidators');
const userValidators = require('./userValidators');
const commentValidators = require('./commentValidators');

const validators = {
  blog: blogValidators,
  user: userValidators,
  comment: commentValidators,
  param: {
    getUserById: [...userValidators.getUserById],
    getBlogById: [...blogValidators.getBlogById],
    getCommentById: [...commentValidators.getCommentById],
    getUserBlogs: [...blogValidators.getUserBlogs],
    getBlogComments: [...commentValidators.getBlogComments]
  }
};

function validateRequest(resource, operation) {
  return [
    // Get all validations rules
    ...(validators[resource]?.[operation] || []),
    
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

module.exports = validateRequest;