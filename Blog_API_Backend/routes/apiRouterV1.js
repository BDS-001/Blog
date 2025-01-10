const router = require("express").Router();
const userController = require('../controllers/userController')
const commentsController = require('../controllers/commentController')
const blogController = require('../controllers/blogController')
const validateRequest = require('../middleware/validation/validateRequest')

// User Routes
router.get("/users", userController.getUsers);
router.get("/users/:userId", validateRequest('param', 'getUserById'), userController.getUserById);
router.post("/users", validateRequest('user', 'create'), userController.createUser);
router.put("/users/:userId", validateRequest('param', 'getUserById'), validateRequest('user', 'update'), userController.updateUser);
router.delete("/users/:userId", validateRequest('param', 'getUserById'), userController.deleteUser);

// Comment Routes
router.get("/comments", commentsController.getAllComments);
router.get("/blogs/:blogId/comments", validateRequest('param', 'getBlogComments'), commentsController.getBlogComments);
router.get("/comments/:commentId", validateRequest('param', 'getCommentById'), commentsController.getCommentById);
router.post("/comments", validateRequest('comment', 'create'), commentsController.createComment);
router.put("/comments/:commentId", validateRequest('param', 'getCommentById'), validateRequest('comment', 'update'), commentsController.updateComment);
router.delete("/comments/:commentId", validateRequest('param', 'getCommentById'), commentsController.deleteComment);

// Blog Routes
router.get("/blogs", blogController.getBlogs);
router.get("/blogs/:blogId", validateRequest('param', 'getBlogById'), blogController.getBlogById);
router.get("/users/:userId/blogs", validateRequest('param', 'getUserBlogs'), blogController.getUserBlogs);
router.post("/blogs", validateRequest('blog', 'create'), blogController.createBlog);
router.put("/blogs/:blogId", validateRequest('param', 'getBlogById'), validateRequest('blog', 'update'), blogController.updateBlog);
router.delete("/blogs/:blogId", validateRequest('param', 'getBlogById'), blogController.deleteBlog);

module.exports = router