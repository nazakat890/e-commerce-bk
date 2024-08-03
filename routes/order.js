const express = require('express');
const {createOrder,getOrders, getOrder, updateOrder, deleteOrder, gettotalSales,getOrderCount,getUserOrder} = require('../controllers/orderController')
const router = express.Router();


router.post('/orders', createOrder)
router.get('/orders', getOrders)
router.get('/orders/:id', getOrder)
router.put('/orders/:id', updateOrder)
router.delete('/orders/:id', deleteOrder)
router.get('/orders/get/totalsales', gettotalSales)
router.get('/orders/get/count', getOrderCount)
router.get('/orders/get/userOrders/:id', getUserOrder)


module.exports = router;