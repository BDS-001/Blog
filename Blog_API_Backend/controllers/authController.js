const {getUserForAuth} = require('../prisma/queries/userQueries');
const { matchedData } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')

const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    NOT_FOUND: 404,
    UNAUTHORIZED: 401,
    INTERNAL_ERROR: 500
};

function handleError(res, operation, error) {
    console.error(`Error ${operation}:`, error);
    return res.status(HTTP_STATUS.INTERNAL_ERROR).json({
        message: `Error ${operation}`,
        error: error.message
    });
}

async function login(req, res) {
    try {
        const {email, password} = matchedData(req, { locations: ['body'] });
        console.log(`matched data: ${email} ${password} and body data ${JSON.stringify(req.body)}`)
        const user = await getUserForAuth(email)

        if (!user) {
            return res.status(HTTP_STATUS.UNAUTHORIZED).json({
                message: 'Invalid credentials'
            });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            return res.status(HTTP_STATUS.UNAUTHORIZED).json({
                message: 'Invalid credentials'
            });
        }

        const token = jwt.sign(
            { 
                id: user.id,
                email: user.email,
                role: user.role.title
            },
            process.env.JWT_SECRET,
            { 
                expiresIn: '7d',
                algorithm: 'HS256'
            }
        );

        const { password: _, ...userWithoutPassword } = user;
        return res.status(HTTP_STATUS.OK).json({
            message: 'Login successful',
            data: {
                user: userWithoutPassword,
                token
            }
        });
    } catch (error) {
        return handleError(res, 'authenticating user', error);
    }
}

module.exports = {login}