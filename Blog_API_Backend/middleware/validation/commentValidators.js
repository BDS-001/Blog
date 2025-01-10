const { body, param } = require('express-validator');

const commentValidators = {
    // Create comment validation rules
    create: [
      body('content')
        .trim()
        .notEmpty()
        .withMessage('Comment content is required')
        .isLength({ max: 1000 })
        .withMessage('Comment content cannot exceed 1000 characters'),
      
      body('blogId')
        .isInt({ min: 1 })
        .withMessage('Valid blog ID is required'),
      
      body('userId')
        .isInt({ min: 1 })
        .withMessage('Valid user ID is required'),
      
      body('parentId')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Parent comment ID must be a valid integer')
    ],
  
    // Update comment validation rules
    update: [
      body('content')
        .trim()
        .notEmpty()
        .withMessage('Comment content is required')
        .isLength({ max: 1000 })
        .withMessage('Comment content cannot exceed 1000 characters')
    ]
  };

module.exports = commentValidators