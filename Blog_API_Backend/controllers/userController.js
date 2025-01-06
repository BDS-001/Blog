const userQueries = require('../prisma/queries/userQueries');

// Constants
const ALLOWED_FIELDS = {
    create: ['email', 'name', 'username', 'password', 'roleId'],
    update: ['name', 'username', 'password', 'roleId']
};

const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    NOT_FOUND: 404,
    INTERNAL_ERROR: 500
};

// Helper Functions
function sanitizeData(data, fields) {
    return Object.entries(data).reduce((sanitized, [key, val]) => {
        if (fields.includes(key)) {
            // Don't trim password field
            sanitized[key] = typeof val === 'string' && key !== 'password' 
                ? val.trim() 
                : val;
        }
        return sanitized;
    }, {});
}

function handleError(res, operation, error) {
    console.error(`Error ${operation}:`, error);
    return res.status(HTTP_STATUS.INTERNAL_ERROR).json({
        message: `Error ${operation}`,
        error: error.message
    });
}

// Handler Functions
async function getUsers(req, res) {
    try {
        const users = await userQueries.getUsers();
        return res.status(HTTP_STATUS.OK).json({
            message: 'Users retrieved successfully',
            data: users
        });
    } catch (error) {
        return handleError(res, 'fetching users', error);
    }
}

async function getUserById(req, res) {
    try {
        const { userId } = req.params;
        const user = await userQueries.getUserById(userId);
        
        if (!user) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({
                message: `User with ID ${userId} not found`
            });
        }

        return res.status(HTTP_STATUS.OK).json({
            message: 'User retrieved successfully',
            data: user
        });
    } catch (error) {
        return handleError(res, 'fetching user', error);
    }
}

async function createUser(req, res) {
    try {
        const createData = sanitizeData(req.body, ALLOWED_FIELDS.create);
        const user = await userQueries.postUsers(createData);
        
        // Remove password from response
        const { password, ...userWithoutPassword } = user;
        
        return res.status(HTTP_STATUS.CREATED).json({
            message: 'User created successfully',
            data: userWithoutPassword
        });
    } catch (error) {
        return handleError(res, 'creating user', error);
    }
}

async function updateUser(req, res) {
    try {
        const { userId } = req.params;
        const updateData = sanitizeData(req.body, ALLOWED_FIELDS.update);
        const updatedUser = await userQueries.putUser(userId, updateData);
        
        if (!updatedUser) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({
                message: `User with ID ${userId} not found`
            });
        }

        // Remove password from response
        const { password, ...userWithoutPassword } = updatedUser;

        return res.status(HTTP_STATUS.OK).json({
            message: 'User updated successfully',
            data: userWithoutPassword
        });
    } catch (error) {
        return handleError(res, 'updating user', error);
    }
}

async function deleteUser(req, res) {
    try {
        const { userId } = req.params;
        const deletedUser = await userQueries.deleteUser(userId);
        
        if (!deletedUser) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({
                message: `User with ID ${userId} not found`
            });
        }

        return res.status(HTTP_STATUS.OK).json({
            message: 'User deleted successfully',
            data: { id: userId }
        });
    } catch (error) {
        return handleError(res, 'deleting user', error);
    }
}

module.exports = {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
};