const { body, param } = require('express-validator');

const blogValidators = {
    create: [
      body('title').trim().notEmpty().withMessage('Title is required'),
      body('content').trim().notEmpty().withMessage('Content is required'),
      body('authorId').isInt().withMessage('Valid authorId is required')
    ],
    update: [
      param('blogId').isInt().withMessage('Blog ID must be an integer'),
      body('title').optional().trim().notEmpty(),
      body('content').optional().trim().notEmpty()
    ]
};

module.exports = {blogValidators}