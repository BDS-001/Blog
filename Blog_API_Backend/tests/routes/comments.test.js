const request = require('supertest');
const app = require('../../app');
const { createTestUser, createTestBlog, createTestComment } = require('../helpers');

describe('Comment Routes', () => {
  let testUser;
  let testBlog;

  beforeEach(async () => {
    testUser = await createTestUser();
    testBlog = await createTestBlog(testUser.id);
  });

  describe('GET /api/v1/comments', () => {
    it('should return all comments', async () => {
      await Promise.all([
        createTestComment(testUser.id, testBlog.id),
        createTestComment(testUser.id, testBlog.id),
        createTestComment(testUser.id, testBlog.id)
      ]);

      const response = await request(app)
        .get('/api/v1/comments')
        .expect(200);

      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.message).toBe('Comments retrieved successfully');
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
    it('should create a new comment', async () => {
      const newComment = {
        content: 'Test comment content',
        userId: testUser.id,
        blogId: testBlog.id
      };

      const response = await request(app)
        .post('/api/v1/comments')
        .send(newComment)
        .expect(201);

      expect(response.body.data.content).toBe(newComment.content);
      expect(response.body.data.userId).toBe(testUser.id);
      expect(response.body.data.blogId).toBe(testBlog.id);
    });

    it('should create a reply to another comment', async () => {
      const parentComment = await createTestComment(testUser.id, testBlog.id);
      
      const replyComment = {
        content: 'This is a reply',
        userId: testUser.id,
        blogId: testBlog.id,
        parentId: parentComment.id
      };

      const response = await request(app)
        .post('/api/v1/comments')
        .send(replyComment)
        .expect(201);

      expect(response.body.data.parentId).toBe(parentComment.id);
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/v1/comments')
        .send({})
        .expect(400);

      expect(response.body.errors).toBeDefined();
    });
  });

  describe('PUT /api/v1/comments/:commentId', () => {
    it('should update an existing comment', async () => {
      const testComment = await createTestComment(testUser.id, testBlog.id);
      const updateData = {
        content: 'Updated comment content'
      };

      const response = await request(app)
        .put(`/api/v1/comments/${testComment.id}`)
        .send(updateData)
        .expect(200);

      expect(response.body.data.content).toBe(updateData.content);
    });

    it('should validate update data', async () => {
      const testComment = await createTestComment(testUser.id, testBlog.id);
      
      const response = await request(app)
        .put(`/api/v1/comments/${testComment.id}`)
        .send({
          content: '' // Empty content should fail validation
        })
        .expect(400);

      expect(response.body.errors).toBeDefined();
    });
  });

  describe('DELETE /api/v1/comments/:commentId', () => {
    it('should mark a comment as deleted while preserving the comment thread', async () => {
      const testComment = await createTestComment(testUser.id, testBlog.id);

      await request(app)
        .delete(`/api/v1/comments/${testComment.id}`)
        .expect(200);

      // Verify comment content is changed to [deleted]
      const response = await request(app)
        .get(`/api/v1/comments/${testComment.id}`)
        .expect(200);

      expect(response.body.data.content).toBe('[deleted]');
    });

    it('should preserve reply structure when parent comment is deleted', async () => {
      // Create a parent comment
      const parentComment = await createTestComment(testUser.id, testBlog.id);
      
      // Create a reply
      const reply = await createTestComment(testUser.id, testBlog.id, { 
        parentId: parentComment.id 
      });

      // Delete the parent comment
      await request(app)
        .delete(`/api/v1/comments/${parentComment.id}`)
        .expect(200);

      // Verify parent comment is marked as deleted
      const parentResponse = await request(app)
        .get(`/api/v1/comments/${parentComment.id}`)
        .expect(200);

      expect(parentResponse.body.data.content).toBe('[deleted]');

      // Verify reply still exists unchanged
      const replyResponse = await request(app)
        .get(`/api/v1/comments/${reply.id}`)
        .expect(200);

      expect(replyResponse.body.data.content).not.toBe('[deleted]');
      expect(replyResponse.body.data.parentId).toBe(parentComment.id);
    });

    it('should handle deeply nested comment threads', async () => {
      // Create a chain of nested comments
      const parentComment = await createTestComment(testUser.id, testBlog.id);
      const reply1 = await createTestComment(testUser.id, testBlog.id, { 
        parentId: parentComment.id 
      });
      const reply2 = await createTestComment(testUser.id, testBlog.id, { 
        parentId: reply1.id 
      });

      // Delete the middle comment
      await request(app)
        .delete(`/api/v1/comments/${reply1.id}`)
        .expect(200);

      // Verify middle comment is marked as deleted
      const deletedResponse = await request(app)
        .get(`/api/v1/comments/${reply1.id}`)
        .expect(200);
      expect(deletedResponse.body.data.content).toBe('[deleted]');

      // Verify parent and child comments remain unchanged
      const parentResponse = await request(app)
        .get(`/api/v1/comments/${parentComment.id}`)
        .expect(200);
      expect(parentResponse.body.data.content).not.toBe('[deleted]');

      const childResponse = await request(app)
        .get(`/api/v1/comments/${reply2.id}`)
        .expect(200);
      expect(childResponse.body.data.content).not.toBe('[deleted]');
    });

    it('should return 404 for non-existent comment', async () => {
      await request(app)
        .delete('/api/v1/comments/999999')
        .expect(404);
    });
  });
});