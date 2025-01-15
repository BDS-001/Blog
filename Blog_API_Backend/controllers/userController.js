const userQueries = require('../prisma/queries/userQueries');
const { matchedData } = require('express-validator');
const bcrypt = require('bcryptjs');


// Constants
const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    NOT_FOUND: 404,
    INTERNAL_ERROR: 500
};

function handleError(res, operation, error) {
    console.error(`Error ${operation}:`, error);
    return res.status(HTTP_STATUS.INTERNAL_ERROR).json({
        message: `Error ${operation}`,
        error: error.message
    });
}

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
        const { userId } = matchedData(req, { locations: ['params'] });
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
        const createData = matchedData(req, { locations: ['body'] })
        createData.password = await bcrypt.hash(createData.password, 10);
        
        const user = await userQueries.postUsers(createData);
        
        return res.status(HTTP_STATUS.CREATED).json({
            message: 'User created successfully',
            data: user
        });
    } catch (error) {
        return handleError(res, 'creating user', error);
    }
}

async function updateUser(req, res) {
    try {
        const { userId } = matchedData(req, { locations: ['params'] });
        const updateData = matchedData(req, { locations: ['body'] })

        if (updateData.password) {
            updateData.password = await bcrypt.hash(updateData.password, 10);
        }

        const updatedUser = await userQueries.putUser(userId, updateData);
        
        if (!updatedUser) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({
                message: `User with ID ${userId} not found`
            });
        }

        return res.status(HTTP_STATUS.OK).json({
            message: 'User updated successfully',
            data: updatedUser
        });
    } catch (error) {
        return handleError(res, 'updating user', error);
    }
}

async function deleteUser(req, res) {
    try {
        const { userId } = matchedData(req, { locations: ['params'] });
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