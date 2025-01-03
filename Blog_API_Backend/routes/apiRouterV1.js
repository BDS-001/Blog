const router = require("express").Router();
const userController = require('../controllers/userController')
const commentsController = require('../controllers/commentController')

//users
router.get("/users", userController.getUsers);
router.get("/users/:userId", userController.getUserById);
router.post("/users", userController.postUser);
router.put("/users/:userId", userController.putUser);
router.delete("/users/:userId", userController.deleteUser);

//comments
router.get("/comments", commentsController.getComments);
router.get("/blogs/:blogId/comments", commentsController.getBlogComments);
router.get("/comments/:commentId", commentsController.getCommentById);
router.post("/comments", commentsController.postComment);
router.put("/comments/:commentId", commentsController.putComment);
router.delete("/comments/:commentId", commentsController.deleteComment);

module.exports = router