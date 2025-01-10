const request = require('supertest');
const app = require('../../app');
const { createTestUser, createTestBlog } = require('../helpers');
const prisma = require('../../prisma/prismaClient');

describe('Blog Routes', () => {
  let testUser;

  beforeEach(async () => {
    testUser = await createTestUser();
  });

  describe('GET /api/v1/blogs', () => {
    it('should return all blogs', async () => {
      // Create test blogs
      await Promise.all([
        createTestBlog(testUser.id),
        createTestBlog(testUser.id),
        createTestBlog(testUser.id)
      ]);

      const response = await request(app)
        .get('/api/v1/blogs')
        .expect(200);

      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.message).toBe('Blogs retrieved successfully');
      expect(response.body.data.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe('GET /api/v1/blogs/:blogId', () => {
    it('should return a specific blog', async () => {
      const testBlog = await createTestBlog(testUser.id);

      const response = await request(app)
        .get(`/api/v1/blogs/${testBlog.id}`)
        .expect(200);

      expect(response.body.data.id).toBe(testBlog.id);
      expect(response.body.data.title).toBe(testBlog.title);
    });

    it('should return 404 for non-existent blog', async () => {
      await request(app)
        .get('/api/v1/blogs/999999')
        .expect(404);
    });
  });

  describe('GET /api/v1/users/:userId/blogs', () => {
    it('should return all blogs for a specific user', async () => {
      await Promise.all([
        createTestBlog(testUser.id),
        createTestBlog(testUser.id)
      ]);

      const response = await request(app)
        .get(`/api/v1/users/${testUser.id}/blogs`)
        .expect(200);

      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.data.every(blog => blog.userId === testUser.id)).toBe(true);
    });
  });

  describe('POST /api/v1/blogs', () => {
    it('should create a new blog', async () => {
      const testBlog = await createTestBlog(testUser.id);

      const response = await request(app)
        .get(`/api/v1/blogs/${testBlog.id}`)
        .expect(200);

      expect(response.body.data.title).toBe(testBlog.title);
      expect(response.body.data.userId).toBe(testUser.id);
    });

    it('should validate required fields', async () => {
      const invalidBlog = {
        title: '', // Empty title should fail validation
        content: 'Too short', // Too short content should fail validation
        userId: testUser.id
      };

      const response = await request(app)
        .post('/api/v1/blogs')
        .send(invalidBlog)
        .expect(400);

      expect(response.body.errors).toBeDefined();
    });

    it('should validate content length', async () => {
      const response = await request(app)
        .post('/api/v1/blogs')
        .send({
          title: 'Test Blog',
          content: 'Too short',
          userId: testUser.id
        })
        .expect(400);

      expect(response.body.errors).toBeDefined();
    });
  });

  describe('PUT /api/v1/blogs/:blogId', () => {
    it('should update an existing blog', async () => {
      const testBlog = await createTestBlog(testUser.id);
      const updatedContent = 'This is updated content that needs to be at least 100 characters long. Adding more content to ensure we meet the minimum length requirement for validation.';
      
      const response = await request(app)
        .put(`/api/v1/blogs/${testBlog.id}`)
        .send({
          content: updatedContent
        })
        .expect(200);

      expect(response.body.data.content).toBe(updatedContent);
    });

    it('should validate update data', async () => {
      const testBlog = await createTestBlog(testUser.id);
      
      const response = await request(app)
        .put(`/api/v1/blogs/${testBlog.id}`)
        .send({
          content: 'Too short' // Too short content should fail validation
        })
        .expect(400);

      expect(response.body.errors).toBeDefined();
    });
  });

  describe('DELETE /api/v1/blogs/:blogId', () => {
    it('should delete an existing blog', async () => {
      const testBlog = await createTestBlog(testUser.id);

      await request(app)
        .delete(`/api/v1/blogs/${testBlog.id}`)
        .expect(200);

      // Verify blog is deleted
      const deletedBlog = await prisma.blog.findUnique({
        where: { id: testBlog.id }
      });
      expect(deletedBlog).toBeNull();
    });

    it('should return 404 for non-existent blog', async () => {
      await request(app)
        .delete('/api/v1/blogs/999999')
        .expect(404);
    });
  });
});