// middleware/validators/blogValidators.js
const { body, param } = require('express-validator');

function generateSlug(title) {
    return title.trim().toLowerCase().replaceAll(' ', '-').replace(/[^\w-]/g, '');
}


const blogValidators = {
  // Create blog validation rules
  create: [
    body('title')
      .trim()
      .notEmpty()
      .withMessage('Title is required')
      .isLength({ min: 3, max: 100 })
      .withMessage('Title must be between 3 and 100 characters'),
    
    // Slug validation that depends on title
    body('slug')
      .customSanitizer((value, { req }) => {
        // Only generate if title exists and is valid
        if (req.body.title) {
          return generateSlug(req.body.title);
        }
        return null;
      })
    .notEmpty()
    .withMessage('Slug generation failed'),

    body('content')
      .trim()
      .notEmpty()
      .withMessage('Blog content is required')
      .isLength({ min: 100 })
      .withMessage('Blog content must be at least 100 characters long'),

    body('userId')
      .isInt({ min: 1 })
      .withMessage('Valid user ID is required'),

    body('isPublic')
      .optional()
      .isBoolean()
      .withMessage('isPublic must be a boolean value')
  ],

  // Update blog validation rules
  update: [
    // Optional title update with slug generation
    body('title')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Title cannot be empty if provided')
      .isLength({ min: 3, max: 100 })
      .withMessage('Title must be between 3 and 100 characters'),
    
    // Update slug if title is provided
    body('slug')
      .if(body('title').exists())
      .customSanitizer((value, { req }) => {
        return generateSlug(req.body.title);
      })
      .notEmpty()
      .withMessage('Slug generation failed')
      .optional(),

    body('content')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Content cannot be empty if provided')
      .isLength({ min: 100 })
      .withMessage('Blog content must be at least 100 characters long'),

    body('isPublic')
      .optional()
      .isBoolean()
      .withMessage('isPublic must be a boolean value')
  ]
};

module.exports = blogValidators;