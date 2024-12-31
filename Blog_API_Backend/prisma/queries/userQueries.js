const prisma = require('../prismaClient')

async function getUsers() {
    try {
        const users = await prisma.user.findMany({
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

module.exports = {
    getUsers,
    postUsers,
}