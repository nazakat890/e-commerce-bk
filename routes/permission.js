const express = require('express');
const { createPermission, getPermission, getPermissions, updatePermission, deletePermission, getUserPermissions } = require('../controllers/permissionController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();
router.get('/permissions',authMiddleware(['read_permission']), getPermissions)
router.get('/permissions/:id',authMiddleware(['read_permission']),getPermission)
router.post('/permissions',authMiddleware(['add_permission']),createPermission)
router.put('/permissions/:id',authMiddleware(['update_permission']), updatePermission )
router.delete('/permissions/:id',authMiddleware(['delete_permission']),deletePermission)

module.exports = router;
