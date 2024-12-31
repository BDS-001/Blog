const userQueries = require('../prisma/queries/userQueries')

// Get all users
async function getUsers(req, res) {
    try {
        const users = await userQueries.getUsers();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Error fetching users", error: error.message });
    }
}

// Get single user by ID
const getUserById = async (req, res) => {
    try {
        const { userId } = req.params;
 
    } catch (error) {
        res.status(500).json({ message: "Error fetching user", error: error.message });
    }
 };
 
 // Create new user 
 const createUser = async (req, res) => {
    try {
        const userData = req.body;
 
    } catch (error) {
        res.status(500).json({ message: "Error creating user", error: error.message });
    }
 };
 
 // Update existing user
 const updateUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const updateData = req.body;
 
    } catch (error) {
        res.status(500).json({ message: "Error updating user", error: error.message });
    }
 };
 
 // Delete user
 const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;
 
    } catch (error) {
        res.status(500).json({ message: "Error deleting user", error: error.message });
    }
 };
 
 module.exports = {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
 };