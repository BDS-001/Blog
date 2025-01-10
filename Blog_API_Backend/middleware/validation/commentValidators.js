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
      param('commentId')
        .isInt({ min: 1 })
        .withMessage('Valid comment ID is required'),
      
      body('content')
        .trim()
        .notEmpty()
        .withMessage('Comment content is required')
        .isLength({ max: 1000 })
        .withMessage('Comment content cannot exceed 1000 characters')
    ],

    getCommentById: [
      param('commentId')
        .isInt({ min: 1 })
        .withMessage('Comment ID must be a positive integer')
    ],

    getBlogComments: [
      param('blogId')
        .isInt({ min: 1 })
        .withMessage('Blog ID must be a positive integer')
    ],
  };

module.exports = commentValidators