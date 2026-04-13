const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth.middleware');
const { getDashboard } = require('../controllers/dashboard.controller');

// =======================
// DASHBOARD
// =======================
router.get('/', auth, getDashboard);

module.exports = router;