const router = require("express").Router();
const userController = require('../controllers/userController')
const commentsController = require('../controllers/commentController')
const blogController = require('../controllers/blogController')
const authController = require('../controllers/authController')
const validateRequest = require('../middleware/validation/validateRequest')
const { isAuthenticated } = require('../middleware/authentication/authMiddleware')

//login
router.post("/auth/login", 
    validateRequest('auth', 'login'),
    authController.login
);

// User Routes
router.get("/users/me", isAuthenticated([]), userController.getCurrentUser);
router.get("/users", isAuthenticated(['isAdmin']), userController.getUsers);
router.get("/users/:userId", 
    isAuthenticated(['isAdmin']),
    validateRequest('param', 'getUserById'),
    userController.getUserById
);
router.post("/users", 
    validateRequest('user', 'create'),
    userController.createUser  // No auth for registration
);
router.put("/users/:userId",
    isAuthenticated(['isAdmin']),
    validateRequest('param', 'getUserById'),
    validateRequest('user', 'update'),
    userController.updateUser
);
router.delete("/users/:userId",
    isAuthenticated(['isAdmin']),
    validateRequest('param', 'getUserById'),
    userController.deleteUser
);

// Comment Routes
router.get("/comments", 
    isAuthenticated(['isAdmin', 'canModerate']),
    commentsController.getAllComments
);
router.get("/blogs/:blogId/comments",
    validateRequest('param', 'getBlogComments'),
    commentsController.getBlogComments  // Public access for blog comments
);
router.get("/comments/:commentId",
    validateRequest('param', 'getCommentById'),
    commentsController.getCommentById  // Public access for individual comments
);
router.post("/comments",
    isAuthenticated(['canComment']),
    validateRequest('comment', 'create'),
    commentsController.createComment
);
router.put("/comments/:commentId",
    isAuthenticated(['canComment']),
    validateRequest('param', 'getCommentById'),
    validateRequest('comment', 'update'),
    commentsController.updateComment
);
router.delete("/comments/:commentId",
    isAuthenticated(['canModerate']),
    validateRequest('param', 'getCommentById'),
    commentsController.deleteComment
);

// Blog Routes
router.get("/blogs", blogController.getBlogs);  // Public access
router.get("/blogs/:blogId",
    validateRequest('param', 'getBlogById'),
    blogController.getBlogById  // Public access
);
router.get("/users/:userId/blogs",
    validateRequest('param', 'getUserBlogs'),
    blogController.getUserBlogs  // Public access
);
router.post("/blogs",
    isAuthenticated(['canCreateBlog']),
    validateRequest('blog', 'create'),
    blogController.createBlog
);
router.put("/blogs/:blogId",
    isAuthenticated(['canCreateBlog']),
    validateRequest('param', 'getBlogById'),
    validateRequest('blog', 'update'),
    blogController.updateBlog
);
router.delete("/blogs/:blogId",
    isAuthenticated(['canCreateBlog', 'isAdmin']),
    validateRequest('param', 'getBlogById'),
    blogController.deleteBlog
);

module.exports = router