const prisma = require('../prismaClient')

async function getUsers(options = {}) {
    try {
        const users = await prisma.user.findMany({
            where: options,
            select: {
                id: true,
                email: true,
                name: true,
                username: true,
                createdAt: true,
                updatedAt: true,
                role: true
            }
        })
        return users
    } catch(error) {
        throw new Error(`Failed to fetch users: ${error.message}`);
    }
}

async function getUserById(userId) {
    try {
        const user = await prisma.user.findUniqe({
            where: {
                id: userId,
            },
            select: {
                id: true,
                email: true,
                name: true,
                username: true,
                createdAt: true,
                updatedAt: true,
                role: true
            }
        })
        return user
    } catch(error) {
        throw new Error(`Failed to fetch user: ${error.message}`);
    }
}

async function postUsers(userData) {
    try {
        const user = await prisma.user.create({
            data: userData,
            select: {
                id: true,
                email: true,
                name: true,
                username: true,
                createdAt: true,
                updatedAt: true,
                role: true
            }
        })
        return user
    } catch (error) {
        throw new Error(`Failed to create user: ${error.message}`);
    }
}

async function putUser(userId, newData) {
    try {
        const user = await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                ...newData,
                updatedAt: new Date()
              },
            select: {
                id: true,
                email: true,
                name: true,
                username: true,
                createdAt: true,
                updatedAt: true,
                role: true
            }
        })
        return user
    } catch (error) {
        throw new Error(`Failed to update user: ${error.message}`);
    }
}

async function deleteUser(userId) {
    try {
        const user = await prisma.user.delete({
            where: {
                id: userId
            }
        })
        return user
    } catch (error) {
        throw new Error(`Failed to delete user: ${error.message}`);
    }
}

module.exports = {
    getUsers,
    postUsers,
    putUser,
    deleteUser,
    getUserById
}