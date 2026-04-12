const express = require('express');
const router = express.Router();

const userController = require('../controllers/user.controller');

// ✅ CORREGIDO
const auth = require('../middleware/auth.middleware');
const requireRole = require('../middleware/role.middleware');

const db = require('../db');

// 🔥 DATOS DEL USUARIO
router.get('/me', auth, userController.getMe);

// 💰 VER CRÉDITOS
router.get('/credits', auth, userController.getCredits);

// 💸 HISTORIAL DE COMISIONES
router.get('/commissions', auth, userController.getMyCommissions);

// ➕ AGREGAR CRÉDITOS
router.post(
  '/add-credits',
  auth,
  requireRole('admin', 'superreseller'),
  userController.addCredits
);

// 👥 CLIENTES DEL RESELLER
router.get(
  '/my-clients',
  auth,
  requireRole('reseller', 'admin'),
  userController.getMyClients
);

// 📊 ESTADÍSTICAS
router.get(
  '/my-stats',
  auth,
  requireRole('reseller', 'admin'),
  userController.getMyStats
);

// 👤 CREAR CLIENTE
router.post(
  '/create-client',
  auth,
  requireRole('reseller', 'admin'),
  userController.createClient
);

// ======================================
// 🔥 REFERIDOS
// ======================================

router.get('/referrals', auth, async (req, res) => {
  try {
    const userId = req.user.id;

    const [referrals] = await db.query(
      "SELECT id, username, email, created_at FROM users WHERE parent_id = ?",
      [userId]
    );

    const [me] = await db.query(
      "SELECT ref_code FROM users WHERE id = ?",
      [userId]
    );

    res.json({
      myCode: me[0]?.ref_code || null,
      total: referrals.length,
      referrals
    });

  } catch (err) {
    console.error("Error referrals:", err);
    res.status(500).json({ error: "Error obteniendo referidos" });
  }
});

module.exports = router;