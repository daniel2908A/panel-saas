const express = require('express');
const router = express.Router();

const bcrypt = require('bcryptjs');
const db = require('../config/db');
const authMiddleware = require('../middleware/auth.middleware');

// 🔹 Crear usuario desde reseller
router.post('/create-user', authMiddleware, async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Faltan datos' });
    }

    // Validar rol
    if (!['admin', 'reseller'].includes(req.user.role)) {
      return res.status(403).json({ error: 'No autorizado' });
    }

    const hashed = await bcrypt.hash(password, 10);

    const [result] = await db.query(
      'INSERT INTO users (username, password, role, parent_id) VALUES (?, ?, ?, ?)',
      [username, hashed, 'client', req.user.id]
    );

    res.json({
      success: true,
      userId: result.insertId
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;