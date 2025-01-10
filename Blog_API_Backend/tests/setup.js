const prisma = require('../prisma/prismaClient');

beforeAll(async () => {
  // Create a test role if it doesn't exist
  await prisma.role.upsert({
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
});

afterEach(async () => {
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
});

afterAll(async () => {
  await prisma.$disconnect();
});