const request = require('supertest');
const app = require('../../app');
const { createTestUser, createTestBlog, createTestComment, generateTestToken } = require('../helpers');
const prisma = require('../../prisma/prismaClient');

describe('Comment Routes', () => {
  let testUser;
  let adminUser;
  let testBlog;
  let authToken;
  let adminToken;

  beforeEach(async () => {
    // Create regular user with comment permissions
    testUser = await createTestUser({
      role: {
        canComment: true
      }
    });
    
    // Create admin user
    adminUser = await createTestUser({
      role: {
        title: 'admin_role',
        canComment: true,
        canModerate: true,
        isAdmin: true
      }
    });

    testBlog = await createTestBlog(testUser.id);
    authToken = await generateTestToken(testUser);
    adminToken = await generateTestToken(adminUser);
  });

  describe('GET /api/v1/comments', () => {
    it('should return all comments when authenticated as admin/moderator', async () => {
      await Promise.all([
        createTestComment(testUser.id, testBlog.id),
        createTestComment(testUser.id, testBlog.id),
        createTestComment(testUser.id, testBlog.id)
      ]);

      const response = await request(app)
        .get('/api/v1/comments')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.message).toBe('Comments retrieved successfully');
    });

    it('should return 401 when not authenticated', async () => {
      await request(app)
        .get('/api/v1/comments')
        .expect(401);
    });
  });

  describe('GET /api/v1/blogs/:blogId/comments', () => {
    it('should return all comments for a specific blog', async () => {
      await Promise.all([
        createTestComment(testUser.id, testBlog.id),
        createTestComment(testUser.id, testBlog.id)
      ]);

      const response = await request(app)
        .get(`/api/v1/blogs/${testBlog.id}/comments`)
        .expect(200);

      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.data.every(comment => comment.blogId === testBlog.id)).toBe(true);
    });
  });

  describe('GET /api/v1/comments/:commentId', () => {
    it('should return a specific comment', async () => {
      const testComment = await createTestComment(testUser.id, testBlog.id);

      const response = await request(app)
        .get(`/api/v1/comments/${testComment.id}`)
        .expect(200);

      expect(response.body.data.id).toBe(testComment.id);
      expect(response.body.data.content).toBe(testComment.content);
    });

    it('should return 404 for non-existent comment', async () => {
      await request(app)
        .get('/api/v1/comments/999999')
        .expect(404);
    });
  });

  describe('POST /api/v1/comments', () => {
    it('should create a new comment when authenticated with proper permissions', async () => {
      const newComment = {
        content: 'Test comment content',
        userId: testUser.id,
        blogId: testBlog.id
      };

      const response = await request(app)
        .post('/api/v1/comments')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newComment)
        .expect(201);

      expect(response.body.data.content).toBe(newComment.content);
      expect(response.body.data.userId).toBe(testUser.id);
      expect(response.body.data.blogId).toBe(testBlog.id);
    });

    it('should return 401 when not authenticated', async () => {
      const newComment = {
        content: 'Test comment content',
        userId: testUser.id,
        blogId: testBlog.id
      };

      await request(app)
        .post('/api/v1/comments')
        .send(newComment)
        .expect(401);
    });

    it('should return 403 when user does not have comment permission', async () => {
      // Create a user with role that cannot comment
      const restrictedUser = await createTestUser({
        role: {
          title: 'no_comment_role',
          canComment: false
        }
      });
      const restrictedToken = await generateTestToken(restrictedUser);

      const newComment = {
        content: 'Test comment content',
        userId: restrictedUser.id,
        blogId: testBlog.id
      };

      await request(app)
        .post('/api/v1/comments')
        .set('Authorization', `Bearer ${restrictedToken}`)
        .send(newComment)
        .expect(403);
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/v1/comments')
        .set('Authorization', `Bearer ${authToken}`)
        .send({})
        .expect(400);

      expect(response.body.errors).toBeDefined();
    });
  });

  describe('PUT /api/v1/comments/:commentId', () => {
    it('should update an existing comment when authenticated', async () => {
      const testComment = await createTestComment(testUser.id, testBlog.id);
      const updateData = {
        content: 'Updated comment content'
      };

      const response = await request(app)
        .put(`/api/v1/comments/${testComment.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.data.content).toBe(updateData.content);
    });

    it('should validate update data', async () => {
      const testComment = await createTestComment(testUser.id, testBlog.id);
      
      const response = await request(app)
        .put(`/api/v1/comments/${testComment.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          content: ''
        })
        .expect(400);

      expect(response.body.errors).toBeDefined();
    });
  });

  describe('DELETE /api/v1/comments/:commentId', () => {
    it('should mark a comment as deleted when authenticated as moderator', async () => {
      const testComment = await createTestComment(testUser.id, testBlog.id);

      await request(app)
        .delete(`/api/v1/comments/${testComment.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      const response = await request(app)
        .get(`/api/v1/comments/${testComment.id}`)
        .expect(200);

      expect(response.body.data.content).toBe('[deleted]');
    });

    it('should handle nested comment threads properly', async () => {
      const parentComment = await createTestComment(testUser.id, testBlog.id);
      const reply = await createTestComment(testUser.id, testBlog.id, { 
        parentId: parentComment.id 
      });

      await request(app)
        .delete(`/api/v1/comments/${parentComment.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      const parentResponse = await request(app)
        .get(`/api/v1/comments/${parentComment.id}`)
        .expect(200);

      const replyResponse = await request(app)
        .get(`/api/v1/comments/${reply.id}`)
        .expect(200);

      expect(parentResponse.body.data.content).toBe('[deleted]');
      expect(replyResponse.body.data.content).not.toBe('[deleted]');
      expect(replyResponse.body.data.parentId).toBe(parentComment.id);
    });

    it('should return 404 for non-existent comment', async () => {
      await request(app)
        .delete('/api/v1/comments/999999')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);
    });
  });
});