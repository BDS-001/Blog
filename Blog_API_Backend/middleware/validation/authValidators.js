const { body } = require('express-validator');

const authValidators = {
    login: [
        body('email')
            .exists()
            .withMessage('Email is required')
            .trim()
            .notEmpty()
            .withMessage('Email cannot be empty')
            .isEmail()
            .withMessage('Must be a valid email address')
            .normalizeEmail(),
        
        body('password')
            .exists()
            .withMessage('Password is required')
            .notEmpty()
            .withMessage('Password cannot be empty')
    ]
};

module.exports = authValidators;