const express = require('express');
const router = express.Router();

const {
  createDeposit,
  confirmDeposit,
  getDeposits
} = require('../controllers/deposit.controller');

const auth = require('../middleware/auth.middleware');

// =======================
// DEPÓSITOS
// =======================

// CREAR
router.post('/', auth, createDeposit);

// CONFIRMAR
router.post('/confirm', auth, confirmDeposit);

// LISTAR
router.get('/', auth, getDeposits);

module.exports = router;