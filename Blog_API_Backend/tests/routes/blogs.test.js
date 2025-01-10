const request = require('supertest');
const app = require('../../app');
const { createTestUser, createTestBlog } = require('../helpers');

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
      const newBlog = {
        title: 'Test Blog',
        content: 'This is a test blog post content that needs to be at least 100 characters long. Adding more content to ensure we meet the minimum length requirement for validation.',
        userId: testUser.id,
        isPublic: true
      };

      const response = await request(app)
        .post('/api/v1/blogs')
        .send(newBlog)
        .expect(201);

      expect(response.body.data.title).toBe(newBlog.title);
      expect(response.body.data.userId).toBe(testUser.id);
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/v1/blogs')
        .send({})
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
      const updateData = {
        title: 'Updated Blog Title',
        content: 'This is updated content that needs to be at least 100 characters long. Adding more content to ensure we meet the minimum length requirement for validation.'
      };

      const response = await request(app)
        .put(`/api/v1/blogs/${testBlog.id}`)
        .send(updateData)
        .expect(200);

      expect(response.body.data.title).toBe(updateData.title);
    });
  });

  describe('DELETE /api/v1/blogs/:blogId', () => {
    it('should delete an existing blog', async () => {
      const testBlog = await createTestBlog(testUser.id);

      await request(app)
        .delete(`/api/v1/blogs/${testBlog.id}`)
        .expect(200);

      // Verify blog is deleted
      await request(app)
        .get(`/api/v1/blogs/${testBlog.id}`)
        .expect(404);
    });
  });
});