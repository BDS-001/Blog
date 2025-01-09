// middleware/validators/userValidators.js
const { body, param } = require('express-validator');

const userValidators = {
  // Create user validation rules
  create: [
    body('email')
      .trim()
      .notEmpty()
      .withMessage('Email is required')
      .isEmail()
      .withMessage('Must be a valid email address')
      .normalizeEmail(),
    
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Name is required')
      .isLength({ min: 2, max: 50 })
      .withMessage('Name must be between 2 and 50 characters'),

    body('username')
      .trim()
      .notEmpty()
      .withMessage('Username is required')
      .isLength({ min: 3, max: 30 })
      .withMessage('Username must be between 3 and 30 characters')
      .matches(/^[a-zA-Z0-9_-]+$/)
      .withMessage('Username can only contain letters, numbers, underscores, and dashes'),

    body('password')
      .notEmpty()
      .withMessage('Password is required')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters long')
      .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]/)
      .withMessage('Password must contain at least one letter and one number'),

    body('roleId')
      .isInt({ min: 1 })
      .withMessage('Valid role ID is required')
  ],

  // Update user validation rules
  update: [
    param('userId')
      .isInt({ min: 1 })
      .withMessage('Valid user ID is required'),

    body('email')
      .optional()
      .trim()
      .isEmail()
      .withMessage('Must be a valid email address')
      .normalizeEmail(),

    body('name')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Name cannot be empty if provided')
      .isLength({ min: 2, max: 50 })
      .withMessage('Name must be between 2 and 50 characters'),

    body('username')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Username cannot be empty if provided')
      .isLength({ min: 3, max: 30 })
      .withMessage('Username must be between 3 and 30 characters')
      .matches(/^[a-zA-Z0-9_-]+$/)
      .withMessage('Username can only contain letters, numbers, underscores, and dashes'),

    body('password')
      .optional()
      .notEmpty()
      .withMessage('Password cannot be empty if provided')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters long')
      .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]/)
      .withMessage('Password must contain at least one letter and one number'),

    body('roleId')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Valid role ID is required if provided')
  ]
};

module.exports = userValidators;