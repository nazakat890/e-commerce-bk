const express = require('express');
const {
      createProduct,
      getProducts,
      getProduct, 
      updateProduct, 
      deleteProduct, 
      getProductCount, 
      getFeatureProduct, 
      gallaryImageUpload } = require('../controllers/productController');
const uploadOptions = require('../utils/multerHelper');
const router = express.Router();


router.post('/products', uploadOptions.single('image'), createProduct)
router.get('/products', getProducts)
router.get('/products/:id', getProduct)
router.put('/products/:id', updateProduct)
router.delete('/products/:id', deleteProduct)
router.get('/products/get/count', getProductCount)
router.get('/products/get/feature/:count', getFeatureProduct)
router.put('/gallaryImages/:id', uploadOptions.array('images'), gallaryImageUpload)


module.exports = router;