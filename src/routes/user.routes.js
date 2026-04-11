const express = require('express');
const router = express.Router();

const userController = require('../controllers/user.controller');

const auth = require('../middleware/auth.middleware');
const requireRole = require('../middleware/role.middleware');


// 🔥 DATOS DEL USUARIO
router.get(
  '/me',
  auth,
  userController.getMe
);


// 💰 VER CRÉDITOS
router.get(
  '/credits',
  auth,
  userController.getCredits
);


// 💸 🔥 HISTORIAL DE COMISIONES (NUEVO)
router.get(
  '/commissions',
  auth,
  userController.getMyCommissions
);


// ➕ AGREGAR CRÉDITOS
router.post(
  '/add-credits',
  auth,
  requireRole('admin', 'superreseller'),
  userController.addCredits
);


// 👥 CLIENTES DEL RESELLER
router.get(
  '/my-clients',
  auth,
  requireRole('reseller', 'admin'),
  userController.getMyClients
);


// 📊 ESTADÍSTICAS
router.get(
  '/my-stats',
  auth,
  requireRole('reseller', 'admin'),
  userController.getMyStats
);


// 👤 CREAR CLIENTE
router.post(
  '/create-client',
  auth,
  requireRole('reseller', 'admin'),
  userController.createClient
);


module.exports = router;