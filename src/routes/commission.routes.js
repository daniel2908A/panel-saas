const express = require('express');
const router = express.Router();

const commissionController = require('../controllers/commission.controller');
const auth = require('../middleware/auth.middleware');

// 💰 GANANCIAS
router.get('/my-earnings', auth, commissionController.getMyEarnings);

module.exports = router;