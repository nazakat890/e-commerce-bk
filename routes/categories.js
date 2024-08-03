const express = require('express');
const { getCategories, getCategory, createCategory, updateCategory, deleteCategory } = require('../controllers/categoryController');
const router = express.Router();

router.get('/category', getCategories)
router.get('/category/:id', getCategory)
router.post('/category', createCategory)
router.put('/category/:id', updateCategory)
router.delete('/category/:id', deleteCategory)



module.exports = router;