const { PrismaClient } = require('@prisma/client')

const prisma = process.env.NODE_ENV === 'development' 
    ? global.prisma || (global.prisma = new PrismaClient())
    : new PrismaClient()

module.exports = prisma