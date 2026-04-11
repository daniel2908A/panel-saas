const express = require('express');
const router = express.Router();

const resellerController = require('../controllers/reseller.controller');

// 🔹 Perfil reseller
router.get('/profile', resellerController.getProfile);

// 🔹 Referidos
router.get('/referrals', resellerController.getReferrals);

// 🔹 Comisiones
router.get('/commissions', resellerController.getCommissions);

module.exports = router;