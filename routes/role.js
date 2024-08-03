const express = require('express');
const { createRole, getRoles, getRole, updateRole, deleteRole } = require('../controllers/roleController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/roles',authMiddleware(['add_roles']), createRole) 
router.get('/roles', authMiddleware(['read_roles']), getRoles)
router.get('/roles/:id', authMiddleware(['read_roles']), getRole)
router.put('/roles/:id', authMiddleware(['update_roles']), updateRole)
router.delete('/roles/:id', authMiddleware(['delete_roles']), deleteRole)

module.exports = router;