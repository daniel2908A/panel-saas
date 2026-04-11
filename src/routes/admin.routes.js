const express = require('express');
const router = express.Router();

const adminController = require('../controllers/admin.controller');

const auth = require('../middleware/auth.middleware');
const requireRole = require('../middleware/role.middleware');


// 👑 CREAR RESELLER
router.post(
  '/create-reseller',
  auth,
  requireRole('admin'),
  adminController.createReseller
);


// 📊 ESTADÍSTICAS
router.get(
  '/stats',
  auth,
  requireRole('admin'),
  adminController.getStats
);


// 👥 LISTAR USUARIOS
router.get(
  '/users',
  auth,
  requireRole('admin'),
  adminController.getAllUsers
);


// 💰 AGREGAR CRÉDITOS
router.post(
  '/add-credits',
  auth,
  requireRole('admin', 'superreseller'),
  adminController.addCreditsToUser
);


// ❌ ELIMINAR USUARIO
router.delete(
  '/delete-user',
  auth,
  requireRole('admin'),
  adminController.deleteUser
);


// 🔥 NUEVO: HACER SUPER RESELLER
router.post(
  '/make-super',
  auth,
  requireRole('admin'),
  adminController.makeSuperReseller
);


module.exports = router;