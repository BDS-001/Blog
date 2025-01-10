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
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(7);
    const title = `Test Blog ${timestamp}_${randomString}`;
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    
    try {
      return await prisma.blog.create({
        data: {
          title,
          slug,
          content: '...content...',
          userId,
          isPublic: true,
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