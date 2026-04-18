const express = require('express');
const router = express.Router();

const orderController = require('../controllers/order.controller');

// =============================
// 💸 COMPRA
// =============================
router.post('/buy', orderController.buyProduct);

// =============================
// 📦 MIS PRODUCTOS
// =============================
router.get('/my-products', orderController.getMyOrders);

module.exports = router;