const express = require('express');
const router = express.Router();

const { subscribe } = require('../controllers/plan.controller');
const authMiddleware = require('../middlewares/auth.Middleware');

// 💳 SUSCRIPCIÓN
router.post('/subscribe', authMiddleware, subscribe);

module.exports = router;