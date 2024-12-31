const router = require("express").Router();
const userController = require('../controllers/userController')

//users
router.get("/users", userController.getUsers);
router.get("/users/:userId", userController.getUserById);
router.post("/users", userController.postUser);
router.put("/users/:userId", userController.putUser);
router.delete("/users/:userId", userController.deleteUser);

module.exports = router