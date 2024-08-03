const express = require('express');
const { getUsers, getUser, createUser, updateUser, deleteUser, verifyUser, getUserPermissions } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/users',authMiddleware(['read_users']), getUsers)
router.get('/users/:id', authMiddleware(['read_users']), getUser)
router.post('/users',authMiddleware(['add_users']), createUser)
router.put('/users/:id', authMiddleware(['update_users']), updateUser)
router.delete('/users/:id', authMiddleware(['delete_users']), deleteUser)
router.patch('/users/:id', authMiddleware(['can_Verify_user']),verifyUser)
router.get('/users-permissions', authMiddleware([]), getUserPermissions)

module.exports = router;