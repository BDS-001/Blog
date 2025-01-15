const request = require('supertest');
const app = require('../../app');
const bcrypt = require('bcryptjs');
const { createTestUser, generateTestToken } = require('../helpers');
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
      // Verify password is not included in response
      expect(response.body.data[0].password).toBeUndefined();
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
      // Verify password is not included in response
      expect(response.body.data.password).toBeUndefined();
    });

    it('should return 404 for non-existent user', async () => {
      await request(app)
        .get('/api/v1/users/999999')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);
    });
  });

  describe('POST /api/v1/users', () => {
    it('should create a new user with hashed password', async () => {
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

      const response = await request(app)
        .post('/api/v1/users')
        .send(userData)
        .expect(201);

      // Verify the response data
      expect(response.body.data.email).toBe(userData.email);
      expect(response.body.data.name).toBe(userData.name);
      expect(response.body.data.username).toBe(userData.username);
      // Verify password is not included in response
      expect(response.body.data.password).toBeUndefined();

      // Verify the password was actually hashed in the database
      const createdUser = await prisma.user.findUnique({
        where: { email: userData.email }
      });
      
      // Verify password is not stored as plaintext
      expect(createdUser.password).not.toBe(userData.password);
      
      // Verify the stored hash matches the original password
      const passwordIsHashed = await bcrypt.compare(
        userData.password,
        createdUser.password
      );
      expect(passwordIsHashed).toBe(true);
    });

    it('should validate password requirements', async () => {
      const role = await prisma.role.findUnique({ 
        where: { title: 'test_role' } 
      });

      const userData = {
        email: 'test@example.com',
        name: 'Test User',
        username: 'testuser',
        password: 'weak', // Too short and missing number
        roleId: role.id
      };

      const response = await request(app)
        .post('/api/v1/users')
        .send(userData)
        .expect(400);

      expect(response.body.errors).toBeDefined();
      expect(response.body.errors[0].msg).toMatch(/Password must be/);
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
      // Verify password is not included in response
      expect(response.body.data.password).toBeUndefined();
    });

    it('should hash password when updating password', async () => {
      const testUser = await createTestUser();
      const newPassword = 'NewTestPass123!';
      
      const response = await request(app)
        .put(`/api/v1/users/${testUser.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ password: newPassword })
        .expect(200);

      // Verify password is not included in response
      expect(response.body.data.password).toBeUndefined();

      // Verify the password was actually hashed in the database
      const updatedUser = await prisma.user.findUnique({
        where: { id: testUser.id }
      });
      
      // Verify password is not stored as plaintext
      expect(updatedUser.password).not.toBe(newPassword);
      
      // Verify the stored hash matches the new password
      const passwordIsHashed = await bcrypt.compare(
        newPassword,
        updatedUser.password
      );
      expect(passwordIsHashed).toBe(true);
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
    it('should delete user and handle associated data properly', async () => {
      // Create a user to delete
      const userToDelete = await createTestUser();
      
      // Create another user and their blog for testing comment handling
      const otherUser = await createTestUser();
      const blog = await prisma.blog.create({
        data: {
          title: `Test Blog ${Date.now()}`,
          content: 'Test content that meets minimum length requirement...',
          userId: otherUser.id,
          slug: `test-blog-${Date.now()}`,
          isPublic: true
        }
      });
      
      // Create comments by the user to be deleted
      await prisma.comment.create({
        data: {
          content: 'Test comment 1',
          userId: userToDelete.id,
          blogId: blog.id
        }
      });
      
      await prisma.comment.create({
        data: {
          content: 'Test comment 2',
          userId: userToDelete.id,
          blogId: blog.id
        }
      });

      // Delete the user
      await request(app)
        .delete(`/api/v1/users/${userToDelete.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      // Verify user is deleted
      const deletedUser = await prisma.user.findUnique({
        where: { id: userToDelete.id }
      });
      expect(deletedUser).toBeNull();

      // Verify the other user's blog still exists
      const remainingBlog = await prisma.blog.findUnique({
        where: { id: blog.id }
      });
      expect(remainingBlog).not.toBeNull();

      // Verify comments are handled correctly (userId set to null but content preserved)
      const comments = await prisma.comment.findMany({
        where: { blogId: blog.id }
      });
      
      expect(comments).toHaveLength(2);
      comments.forEach(comment => {
        expect(comment.userId).toBeNull();
        expect(comment.content).not.toBe('[deleted]');
      });
    });

    it('should return 404 for non-existent user', async () => {
      await request(app)
        .delete('/api/v1/users/999999')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);
    });
  });
});