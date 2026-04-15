const express = require('express');
const router = express.Router();

const { getUsers } = require('../controllers/user.controller');
const db = require('../db');

// =======================
// OBTENER USUARIOS
// =======================
router.get('/', getUsers);

// =======================
// 🔥 ACTIVAR USUARIO (FIX)
// =======================
router.post('/activate/:id', async (req, res) => {
  try {
    const userId = req.params.id;

    await db.query(
      "UPDATE users SET is_active = 1 WHERE id = ?",
      [userId]
    );

    res.json({ message: "Usuario activado correctamente" });

  } catch (err) {
    console.error("ERROR ACTIVANDO:", err);
    res.status(500).json({ error: "Error activando usuario" });
  }
});

module.exports = router;