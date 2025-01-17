const prisma = require('../prismaClient');

const defaultRoles = [
  {
    title: 'reader',
    canComment: true,
    canCreateBlog: false,
    canModerate: false,
    isAdmin: false
  },
  {
    title: 'author',
    canComment: true,
    canCreateBlog: true,
    canModerate: false,
    isAdmin: false
  },
  {
    title: 'moderator',
    canComment: true,
    canCreateBlog: true,
    canModerate: true,
    isAdmin: false
  },
  {
    title: 'admin',
    canComment: true,
    canCreateBlog: true,
    canModerate: true,
    isAdmin: true
  }
];

async function initializeRoles() {
  try {
    console.log('Starting role initialization...');
    
    for (const roleData of defaultRoles) {
      const existingRole = await prisma.role.findUnique({
        where: { title: roleData.title }
      });

      if (!existingRole) {
        await prisma.role.create({
          data: roleData
        });
        console.log(`Created ${roleData.title} role`);
      } else {
        // Optionally update existing role to ensure it has the correct permissions
        await prisma.role.update({
          where: { title: roleData.title },
          data: roleData
        });
        console.log(`Updated ${roleData.title} role`);
      }
    }

    console.log('Role initialization completed successfully');
  } catch (error) {
    console.error('Error initializing roles:', error);
    throw error;
  }
}

module.exports = initializeRoles;