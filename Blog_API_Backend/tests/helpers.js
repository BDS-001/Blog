const prisma = require('../prisma/prismaClient');

async function getTestRole() {
  try {
    // Try to find the test role
    let role = await prisma.role.findUnique({
      where: { title: 'test_role' }
    });

    // If role doesn't exist, create it
    if (!role) {
      role = await prisma.role.create({
        data: {
          title: 'test_role',
          canComment: true,
          canCreateBlog: true,
          canModerate: false,
          isAdmin: false
        }
      });
    }

    return role;
  } catch (error) {
    console.error('Error getting test role:', error);
    throw error;
  }
}

async function createTestUser(overrides = {}) {
  try {
    const role = await getTestRole();
    if (!role) {
      throw new Error('Failed to get or create test role');
    }

    return await prisma.user.create({
      data: {
        email: `test${Date.now()}_${Math.random().toString(36).substring(2)}@example.com`,
        name: 'Test User',
        username: `testuser${Date.now()}_${Math.random().toString(36).substring(2)}`,
        password: 'TestPass123!',
        roleId: role.id,
        ...overrides
      }
    });
  } catch (error) {
    console.error('Error creating test user:', error);
    throw error;
  }
}

async function createTestBlog(userId, overrides = {}) {
  try {
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
  } catch (error) {
    console.error('Error creating test blog:', error);
    throw error;
  }
}

async function createTestComment(userId, blogId, overrides = {}) {
  try {
    return await prisma.comment.create({
      data: {
        content: 'Test comment content',
        userId: userId,
        blogId: blogId,
        ...overrides
      }
    });
  } catch (error) {
    console.error('Error creating test comment:', error);
    throw error;
  }
}

module.exports = {
  createTestUser,
  createTestBlog,
  createTestComment,
  getTestRole
};