const express = require('express');
const router = express.Router();

const adminController = require('../controllers/admin.controller');

const auth = require('../middleware/auth.middleware');
const requireRole = require('../middleware/role.middleware');

const db = require('../db'); // 🔥 IMPORTANTE


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
  '/add