const prisma = require('../prismaClient')

async function getUsers() {
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
}

async function postUsers(userData) {
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
}