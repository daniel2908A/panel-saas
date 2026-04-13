const express = require('express');
const router = express.Router();

const resellerController = require('../controllers/reseller.controller');
const authMiddleware = require('../middleware/auth.middleware');

// =======================
// RUTAS RESELLER
// =======================

// PERFIL
router.get('/profile', authMiddleware, resellerController.getProfile);

// REFERIDOS
router.get('/referrals', authMiddleware, resellerController.getReferrals);

// COMISIONES
router.get('/commissions', authMiddleware, resellerController.getCommissions);

module.exports = router;