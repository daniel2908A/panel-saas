const express = require('express');
const router = express.Router();

const { getUsers, getMe } = require('../controllers/user.controller');
const db = require('../db');
const authMiddleware = require('../middleware/auth.middleware');

// =======================
// OBTENER USUARIOS
// =======================
router.get('/', getUsers);

// =======================
// 🔥 USUARIO LOGUEADO (FIX DASHBOARD)
// =======================
router.get('/me', authMiddleware, getMe);

// =======================
// ⚠️ ACTIVAR USUARIO (NO SE USA PERO LO DEJO COMPATIBLE)
// =======================
router.post('/activate/:id', async (req, res) => {
  try {
    const userId = req.params.id;

    // 🔥 CAMBIO A status (NO is_active)
    await db.query(
      "UPDATE users SET status = 'active' WHERE id = ?",
      [userId]
    );

    res.json({ message: "Usuario activado correctamente" });

  } catch (err) {
    console.error("ERROR ACTIVANDO:", err);
    res.status(500).json({ error: "Error activando usuario" });
  }
});

module.exports = router;