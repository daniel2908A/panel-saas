const express = require('express');
const router = express.Router();

const { getMyEarnings } = require('../controllers/commission.controller');
const auth = require('../middleware/auth.middleware');

// =======================
// COMISIONES
// =======================
router.get('/my-earnings', auth, getMyEarnings);

module.exports = router;