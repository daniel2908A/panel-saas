const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth.middleware');
const { getDashboard } = require('../controllers/dashboard.controller');

// =======================
// DASHBOARD
// =======================
// Aseguramos que la ruta sea segura y retorne correctamente los datos
router.get('/', auth, getDashboard);

module.exports = router;