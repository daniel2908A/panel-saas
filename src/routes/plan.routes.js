const express = require('express');
const router = express.Router();
const { subscribe } = require('../controllers/plan.controller');
const authMiddleware = require('../middlewares/authMiddleware');

// 🔥 CREAR SUSCRIPCIÓN
router.post('/subscribe', authMiddleware, subscribe);

module.exports = router;