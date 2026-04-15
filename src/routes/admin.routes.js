const express = require('express');
const router = express.Router();

const {
  getAllUsers,
  activateUserPlan,
  deleteUser,
  addCreditsToUser,
  removeCreditsFromUser
} = require('../controllers/admin.controller');

// =======================
// LISTAR USUARIOS
// =======================
router.get('/users', getAllUsers);

// =======================
// ACTIVAR PLAN
// =======================
router.post('/activate-plan', activateUserPlan);

// =======================
// ELIMINAR USUARIO
// =======================
router.post('/delete-user', deleteUser);

// =======================
// CRÉDITOS
// =======================
router.post('/add-credits', addCreditsToUser);
router.post('/remove-credits', removeCreditsFromUser);

module.exports = router;