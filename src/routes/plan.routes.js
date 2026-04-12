const express = require('express');
const router = express.Router();

const { subscribe } = require('../controllers/plan.controller');
const authMiddleware = require('../middlewares/auth.middleware'); // ✅ CORRECTO

// 💳 SUSCRIPCIÓN
router.post('/subscribe', authMiddleware, subscribe);

module.exports = router;