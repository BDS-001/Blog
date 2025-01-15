const request = require('supertest');
const app = require('../../app');
const { createTestUser, createTestBlog, createTestComment, generateTestToken } = require('../helpers');
const prisma = require('../../prisma/prismaClient');

describe('User Routes', () => {
  let adminUser;
  let adminToken;

  beforeEach(async () => {
    // Create an admin user with a unique role
    adminUser = await createTestUser({
      role: {
        title: `admin_role_${Date.now()}`, // Ensure unique role title
        canComment: true,
        canCreateBlog: true,
        canModerate: true,
        isAdmin: true
      }
    });
    adminToken = await generateTestToken(adminUser);
  });

  describe('GET /api/v1/users', () => {
    it('should return all users when authenticated as admin', async () => {
      // Create additional test users
      await Promise.all([
        createTestUser(),
        createTestUser(),
        createTestUser()
      ]);

      const response = await request(app)
        .get('/api/v1/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.message).toBe('Users retrieved successfully');
      expect(response.body.data.length).toBeGreaterThanOrEqual(3);
    });

    it('should return 401 when not authenticated', async () => {
      await request(app)
        .get('/api/v1/users')
        .expect(401);
    });
  });

  describe('GET /api/v1/users/:userId', () => {
    it('should return a specific user when authenticated as admin', async () => {
      const testUser = await createTestUser();

      const response = await request(app)
        .get(`/api/v1/users/${testUser.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.data.id).toBe(testUser.id);
      expect(response.body.data.email).toBe(testUser.email);
      expect(response.body.data.username).toBe(testUser.username);
    });

    it('should return 404 for non-existent user', async () => {
      await request(app)
        .get('/api/v1/users/999999')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);
    });
  });

  describe('POST /api/v1/users', () => {
    it('should create a new user', async () => {
      const role = await prisma.role.findUnique({ 
        where: { title: 'test_role' } 
      });
      
      if (!role) {
        throw new Error('Test role not found');
      }

      const timestamp = Date.now();
      const userData = {
        email: `test${timestamp}@example.com`,
        name: 'Test User',
        username: `testuser${timestamp}`,
        password: 'TestPass123!',
        roleId: role.id
      };

      await request(app)
        .post('/api/v1/users')
        .send(userData)
        .expect(201)
        .expect((res) => {
          expect(res.body.data.email).toBe(userData.email);
          expect(res.body.data.name).toBe(userData.name);
          expect(res.body.data.username).toBe(userData.username);
        });
    });
  });

  describe('PUT /api/v1/users/:userId', () => {
    it('should update an existing user when authenticated as admin', async () => {
      const testUser = await createTestUser();
      const updateData = {
        name: 'Updated Name'
      };

      const response = await request(app)
        .put(`/api/v1/users/${testUser.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.data.name).toBe(updateData.name);
    });

    it('should validate update data', async () => {
      const testUser = await createTestUser();
      
      const response = await request(app)
        .put(`/api/v1/users/${testUser.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          email: 'invalid-email'
        })
        .expect(400);

      expect(response.body.errors).toBeDefined();
    });
  });

  describe('DELETE /api/v1/users/:userId', () => {
    it('should delete user when authenticated as admin', async () => {
      const userToDelete = await createTestUser();
      const otherUser = await createTestUser();
      const otherUserBlog = await createTestBlog(otherUser.id);
      
      const comment1 = await createTestComment(userToDelete.id, otherUserBlog.id, {
        content: "Test comment 1"
      });
      const comment2 = await createTestComment(userToDelete.id, otherUserBlog.id, {
        content: "Test comment 2"
      });

      await request(app)
        .delete(`/api/v1/users/${userToDelete.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      const deletedUser = await prisma.user.findUnique({
        where: { id: userToDelete.id }
      });
      expect(deletedUser).toBeNull();

      const remainingBlog = await prisma.blog.findUnique({
        where: { id: otherUserBlog.id }
      });
      expect(remainingBlog).not.toBeNull();

      const updatedComment1 = await prisma.comment.findUnique({
        where: { id: comment1.id }
      });
      const updatedComment2 = await prisma.comment.findUnique({
        where: { id: comment2.id }
      });

      expect(updatedComment1).not.toBeNull();
      expect(updatedComment2).not.toBeNull();
      expect(updatedComment1.content).toBe("Test comment 1");
      expect(updatedComment2.content).toBe("Test comment 2");
      expect(updatedComment1.userId).toBeNull();
      expect(updatedComment2.userId).toBeNull();
    });
  });
});