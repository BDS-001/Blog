const prisma = require('../prisma/prismaClient');
const jwt = require('jsonwebtoken');

async function generateTestToken(user) {
  const secret = process.env.JWT_SECRET || 'test-secret';
  return jwt.sign(
    { 
      id: user.id,
      email: user.email,
      role: user.role 
    },
    secret,
    { 
      expiresIn: '1h',
      algorithm: 'HS256'
    }
  );
}

async function getTestRole(rolePermissions = {}) {
  try {
    const defaultPermissions = {
      title: 'test_role',
      canComment: true,
      canCreateBlog: true,
      canModerate: false,
      isAdmin: false,
      ...rolePermissions
    };

    // Try to find or create the role with specified permissions
    let role = await prisma.role.upsert({
      where: { 
        title: defaultPermissions.title 
      },
      update: defaultPermissions,
      create: defaultPermissions
    });

    return role;
  } catch (error) {
    console.error('Error getting test role:', error);
    throw error;
  }
}

async function createTestUser(overrides = {}) {
  try {
    // Extract role permissions if provided
    const { role: rolePermissions, ...userOverrides } = overrides;
    
    const role = await getTestRole(rolePermissions);
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
        ...userOverrides
      },
      include: {
        role: true
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
  const title = overrides.title || `Test Blog ${timestamp}_${randomString}`;
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  
  try {
    return await prisma.blog.create({
      data: {
        title,
        slug,
        content: 'This is test content that needs to be at least 100 characters long. Adding more content to ensure we meet the minimum length requirement for validation.',
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
  getTestRole,
  generateTestToken
};