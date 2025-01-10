const request = require('supertest');
const app = require('../../app');
const { createTestUser } = require('../helpers');

describe('User Routes', () => {
  describe('GET /api/v1/users', () => {
    it('should return all users', async () => {
      // Create test users
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
    });

    it('should return 404 for non-existent user', async () => {
      await request(app)
        .get('/api/v1/users/999999')
        .expect(404);
    });
  });

  describe('POST /api/v1/users', () => {
    it('should create a new user', async () => {
      const userData = await createTestUser();

      const response = await request(app)
        .post('/api/v1/users')
        .send(userData)
        .expect(201);

      expect(response.body.data.email).toBe(newUser.email);
      expect(response.body.data.name).toBe(newUser.name);
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/v1/users')
        .send({})
        .expect(400);

      expect(response.body.errors).toBeDefined();
    });

    it('should validate email format', async () => {
      const response = await request(app)
        .post('/api/v1/users')
        .send({
          email: 'invalid-email',
          name: 'Test User',
          username: 'testuser',
          password: 'Password123!',
          roleId: 1
        })
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
    it('should delete an existing user', async () => {
      const testUser = await createTestUser();

      await request(app)
        .delete(`/api/v1/users/${testUser.id}`)
        .expect(200);

      // Verify user is deleted
      const getResponse = await request(app)
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