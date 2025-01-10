const prisma = require('../prisma/prismaClient');

beforeAll(async () => {
    try {
      const testRole = await prisma.role.upsert({
        where: { title: 'test_role' },
        update: {},
        create: {
          title: 'test_role',
          canComment: true,
          canCreateBlog: true,
          canModerate: false,
          isAdmin: false
        }
      });
      console.log('Test role created/updated:', testRole);
    } catch (error) {
      console.error('Error creating test role:', error);
      throw error;
    }
  });
  
  // Clean up after each test
  afterEach(async () => {
    try {
      // Clean up test data
      const deleteComments = prisma.comment.deleteMany();
      const deleteBlogs = prisma.blog.deleteMany();
      const deleteUsers = prisma.user.deleteMany();
      
      // Use transactions to delete in the correct order
      await prisma.$transaction([
        deleteComments,
        deleteBlogs,
        deleteUsers
      ]);
    } catch (error) {
      console.error('Error cleaning up test data:', error);
      throw error;
    }
  });
  
  // Disconnect Prisma after all tests
  afterAll(async () => {
    await prisma.$disconnect();
  });