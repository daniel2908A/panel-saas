const express = require('express');
const router = express.Router();

const { subscribe } = require('../controllers/plan.controller');
const auth = require('../middleware/auth.middleware');

// =======================
// SUSCRIPCIÓN
// =======================
router.post('/subscribe', auth, subscribe);

module.exports = router;