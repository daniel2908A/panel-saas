const express = require('express');
const router = express.Router();

const { buyProduct, getMyOrders } = require('../controllers/order.controller');
const auth = require('../middleware/auth.middleware');

// =======================
// ÓRDENES
// =======================

// COMPRA
router.post('/buy', auth, buyProduct);

// HISTORIAL
router.get('/my-orders', auth, getMyOrders);

module.exports = router;