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
      // Get the test role first
      const role = await prisma.role.findUnique({ 
        where: { title: 'test_role' } 
      });
      
      if (!role) {
        throw new Error('Test role not found');
      }

      const userData = {
        email: `test${Date.now()}_${Math.random().toString(36).substring(2)}@example.com`,
        name: 'Test User',
        username: `testuser${Date.now()}_${Math.random().toString(36).substring(2)}`,
        password: 'TestPass123!',
        roleId: role.id
      };

      const response = await request(app)
        .post('/api/v1/users')
        .send(userData)
        .expect(201);

      // Log the response body if validation fails
      if (response.status !== 201) {
        console.log('Validation errors:', response.body);
      }

      expect(response.body.data.email).toBe(userData.email);
      expect(response.body.data.name).toBe(userData.name);
      expect(response.body.data.username).toBe(userData.username);
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/v1/users')
        .send({})
        .expect(400);

      expect(response.body.errors).toBeDefined();
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
    it('should delete a user and handle their comments', async () => {
      const testUser = await createTestUser();
      const testBlog = await createTestBlog(testUser.id);
      
      // Create comments
      await createTestComment(testUser.id, testBlog.id);
      await createTestComment(testUser.id, testBlog.id);
      
      // Delete the user
      await request(app)
        .delete(`/api/v1/users/${testUser.id}`)
        .expect(200);

      // Verify user is deleted
      const deletedUser = await prisma.user.findUnique({
        where: { id: testUser.id }
      });
      expect(deletedUser).toBeNull();

      // Verify the user's comments are properly handled
      const comments = await prisma.comment.findMany({
        where: { userId: null }
      });
      expect(comments.length).toBeGreaterThan(0);
      comments.forEach(comment => {
        expect(comment.userId).toBeNull();
      });
    });

    it('should handle a user with no comments', async () => {
      const testUser = await createTestUser();

      await request(app)
        .delete(`/api/v1/users/${testUser.id}`)
        .expect(200);

      // Verify user is deleted
      await request(app)
        .get(`/api/v1/users/${testUser.id}`)
        .expect(404);
    });

    it('should return 404 for non-existent user', async () => {
      await request(app)
        .delete('/api/v1/users/999999')
        .expect(404);
    });
  });
});