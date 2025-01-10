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
    it('should delete an existing comment', async () => {
      const testComment = await createTestComment(testUser.id, testBlog.id);

      await request(app)
        .delete(`/api/v1/comments/${testComment.id}`)
        .expect(200);

      // Verify comment is deleted
      await request(app)
        .get(`/api/v1/comments/${testComment.id}`)
        .expect(404);
    });

    it('should delete a comment and its replies', async () => {
      const parentComment = await createTestComment(testUser.id, testBlog.id);
      const replyComment = await createTestComment(testUser.id, testBlog.id, { parentId: parentComment.id });

      await request(app)
        .delete(`/api/v1/comments/${parentComment.id}`)
        .expect(200);

      // Verify both comments are deleted
      await request(app)
        .get(`/api/v1/comments/${parentComment.id}`)
        .expect(404);
      await request(app)
        .get(`/api/v1/comments/${replyComment.id}`)
        .expect(404);
    });

    it('should return 404 for non-existent comment', async () => {
      await request(app)
        .delete('/api/v1/comments/999999')
        .expect(404);
    });
  });
});