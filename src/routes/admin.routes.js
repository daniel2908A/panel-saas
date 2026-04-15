const express = require('express');
const router = express.Router();

const adminController = require('../controllers/admin.controller');

// =======================
// USUARIOS
// =======================
router.get('/users', adminController.getAllUsers);

// =======================
// ACTIVAR USUARIO 🔥
/* ESTA ES LA CLAVE */
router.post('/activate-plan', adminController.activateUserPlan);

// =======================
// ELIMINAR
// =======================
router.post('/delete-user', adminController.deleteUser);

// =======================
// CREDITOS
// =======================
router.post('/add-credits', adminController.addCreditsToUser);
router.post('/remove-credits', adminController.removeCreditsFromUser);

module.exports = router;