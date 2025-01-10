const prisma = require('../prisma/prismaClient');

async function getTestRole() {
  return await prisma.role.findUnique({
    where: { title: 'test_role' }
  });
}

async function createTestUser(overrides = {}) {
  const role = await getTestRole();
  return await prisma.user.create({
    data: {
      email: `test${Date.now()}@example.com`,
      name: 'Test User',
      username: `testuser${Date.now()}`,
      password: 'TestPass123!',
      roleId: role.id,
      ...overrides
    }
  });
}

async function createTestBlog(userId, overrides = {}) {
  return await prisma.blog.create({
    data: {
      title: `Test Blog ${Date.now()}`,
      content: 'This is a test blog post content that needs to be at least 100 characters long. Adding more content to ensure we meet the minimum length requirement for validation.',
      userId: userId,
      isPublic: true,
      slug: `test-blog-${Date.now()}`,
      ...overrides
    }
  });
}

async function createTestComment(userId, blogId, overrides = {}) {
  return await prisma.comment.create({
    data: {
      content: 'Test comment content',
      userId: userId,
      blogId: blogId,
      ...overrides
    }
  });
}

module.exports = {
  createTestUser,
  createTestBlog,
  createTestComment,
  getTestRole
};