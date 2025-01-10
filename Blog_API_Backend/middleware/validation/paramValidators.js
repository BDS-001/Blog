// middleware/validators/paramValidators.js
const { param } = require('express-validator');

// Helper function to create an ID validator
const createIdValidator = (paramName) => {
  return param(paramName)
    .trim()
    .notEmpty()
    .withMessage(`${paramName} is required`)
    .toInt()  // Convert string to integer
    .isInt({ min: 1 })
    .withMessage(`${paramName} must be a positive integer`);
};

const paramValidators = {
  getUserById: [
    createIdValidator('userId')
  ],
  
  getBlogById: [
    createIdValidator('blogId')
  ],
  
  getCommentById: [
    createIdValidator('commentId')
  ],
  
  getUserBlogs: [
    createIdValidator('userId')
  ],
  
  getBlogComments: [
    createIdValidator('blogId')
  ]
};

module.exports = paramValidators;