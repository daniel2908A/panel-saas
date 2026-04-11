const express = require('express');
const router = express.Router();

const orderController = require('../controllers/order.controller');
const auth = require('../middleware/auth.middleware');

console.log('ORDER CONTROLLER:', orderController);

// 🛒 COMPRA
router.post('/buy', auth, orderController.buyProduct);

// 📦 HISTORIAL
router.get('/my-orders', auth, orderController.getMyOrders);

module.exports = router;