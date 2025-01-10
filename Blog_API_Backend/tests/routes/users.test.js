const request = require('supertest');
const app = require('../../app');
const { createTestUser, createTestBlog, createTestComment } = require('../helpers');
const prisma = require('../../prisma/prismaClient');

describe('User Routes', () => {
  describe('GET /api/v1/users', () => {
    it('should return all users', async () => {
      // Create test users directly using helper function
      await Promise.all([
        createTestUser(),
        createTestUser(),
        createTestUser()
      ]);

      const response = await request(app)
        .get('/api/v1/users')
        .expect(200);

      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.message).toBe('Users retrieved successfully');
      expect(response.body.data.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe('GET /api/v1/users/:userId', () => {
    it('should return a specific user', async () => {
      const testUser = await createTestUser();

      const response = await request(app)
        .get(`/api/v1/users/${testUser.id}`)
        .expect(200);

      expect(response.body.data.id).toBe(testUser.id);
      expect(response.body.data.email).toBe(testUser.email);
      expect(response.body.data.username).toBe(testUser.username);
    });

    it('should return 404 for non-existent user', async () => {
      await request(app)
        .get('/api/v1/users/999999')
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
    it('should update an existing user', async () => {
      const testUser = await createTestUser();
      const updateData = {
        name: 'Updated Name'
      };

      const response = await request(app)
        .put(`/api/v1/users/${testUser.id}`)
        .send(updateData)
        .expect(200);

      expect(response.body.data.name).toBe(updateData.name);
    });

    it('should validate update data', async () => {
      const testUser = await createTestUser();
      
      const response = await request(app)
        .put(`/api/v1/users/${testUser.id}`)
        .send({
          email: 'invalid-email'
        })
        .expect(400);

      expect(response.body.errors).toBeDefined();
    });
  });

  describe('DELETE /api/v1/users/:userId', () => {
    it('should delete user, their blogs, and handle comments correctly', async () => {
      // Create two users
      const userToDelete = await createTestUser();
      const otherUser = await createTestUser();
      
      // Create a blog by the other user
      const otherUserBlog = await createTestBlog(otherUser.id);
      
      // Create comments by the user-to-delete on the other user's blog
      const comment1 = await createTestComment(userToDelete.id, otherUserBlog.id, {
          content: "Test comment 1"
      });
      const comment2 = await createTestComment(userToDelete.id, otherUserBlog.id, {
          content: "Test comment 2"
      });

      // Delete the user
      await request(app)
        .delete(`/api/v1/users/${userToDelete.id}`)
        .expect(200);

      // Verify user is deleted
      const deletedUser = await prisma.user.findUnique({
        where: { id: userToDelete.id }
      });
      expect(deletedUser).toBeNull();

      // Verify other user's blog still exists
      const remainingBlog = await prisma.blog.findUnique({
        where: { id: otherUserBlog.id }
      });
      expect(remainingBlog).not.toBeNull();

      // Verify comments remain with original content but null userId
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