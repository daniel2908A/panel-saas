const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../db'); // ajusta si tu ruta es distinta
const authMiddleware = require('../middleware/auth.Middleware');

router.post('/create-user', authMiddleware, async (req, res) => {
  try {
    const { username, password } = req.body;

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
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;