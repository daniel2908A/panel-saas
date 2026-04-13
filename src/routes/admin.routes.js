const express = require('express');
const router = express.Router();

const {
  createReseller,
  getStats,
  getAllUsers,
  addCreditsToUser,
  removeCreditsFromUser,
  activateUserPlan
} = require('../controllers/admin.controller');

const auth = require('../middleware/auth.middleware');
const requireRole = require('../middleware/role.middleware');

// =======================
// ADMIN
// =======================

// CREAR RESELLER
router.post('/create-reseller', auth, requireRole('admin'), createReseller);

// ESTADÍSTICAS
router.get('/stats', auth, requireRole('admin'), getStats);

// LISTAR USUARIOS
router.get('/users', auth, requireRole('admin'), getAllUsers);

// AGREGAR CRÉDITOS
router.post('/add', auth, requireRole('admin'), addCreditsToUser);

// RESTAR CRÉDITOS
router.post('/remove', auth, requireRole('admin'), removeCreditsFromUser);

// ACTIVAR PLAN / SUPER RESELLER
router.post('/activate-plan', auth, requireRole('admin'), activateUserPlan);

module.exports = router;