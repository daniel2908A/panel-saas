const express = require('express');
const router = express.Router();

const userController = require('../controllers/user.controller');
const auth = require('../middleware/auth.middleware');
const requireRole = require('../middleware/role.middleware');

// =======================
// USUARIO
// =======================

// DATOS DEL USUARIO
router.get('/me', auth, userController.getMe);

// CRÉDITOS
router.get('/credits', auth, userController.getCredits);

// COMISIONES
router.get('/commissions', auth, userController.getMyCommissions);

// =======================
// ADMIN / RESELLER
// =======================

// AGREGAR CRÉDITOS
router.post(
  '/add-credits',
  auth,
  requireRole('admin', 'super_reseller'),
  userController.addCredits
);

// CLIENTES
router.get(
  '/my-clients',
  auth,
  requireRole('reseller', 'admin'),
  userController.getMyClients
);

// ESTADÍSTICAS
router.get(
  '/my-stats',
  auth,
  requireRole('reseller', 'admin'),
  userController.getMyStats
);

// CREAR CLIENTE
router.post(
  '/create-client',
  auth,
  requireRole('reseller', 'admin'),
  userController.createClient
);

// =======================
// REFERIDOS
// =======================
router.get('/referrals', auth, userController.getReferrals);

module.exports = router;