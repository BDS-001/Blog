const router = require("express").Router();
const userController = require('../controllers/userController')
const commentsController = require('../controllers/commentController')
const blogController = require('../controllers/blogController')

//users
router.get("/users", userController.getUsers);
router.get("/users/:userId", userController.getUserById);
router.post("/users", userController.createUser);
router.put("/users/:userId", userController.updateUser);
router.delete("/users/:userId", userController.deleteUser);

//comments
router.get("/comments", commentsController.getAllComments);
router.get("/blogs/:blogId/comments", commentsController.getBlogComments);
router.get("/comments/:commentId", commentsController.getCommentById);
router.post("/comments", commentsController.createComment);
router.put("/comments/:commentId", commentsController.updateComment);
router.delete("/comments/:commentId", commentsController.deleteComment);

//blogs
router.get("/blogs", blogController.getBlogs);
router.get("/blogs/:blogId", blogController.getBlogById);
router.get("/users/:userId/blogs", blogController.getUserBlogs);
router.post("/blogs", blogController.createBlog);
router.put("/blogs/:blogId", blogController.updateBlog);
router.delete("/blogs/:blogId", blogController.deleteBlog);

module.exports = router