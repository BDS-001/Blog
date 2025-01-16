const { body } = require('express-validator');

const authValidators = {
    login: [
        body('email')
            .trim()
            .notEmpty()
            .withMessage('Email is required')
            .isEmail()
            .withMessage('Must be a valid email address')
            .normalizeEmail(),
        
        body('password')
            .notEmpty()
            .withMessage('Password is required')
    ]
};

module.exports = authValidators;