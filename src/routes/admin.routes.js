const express = require('express');
const router = express.Router();

const adminController = require('../controllers/admin.controller');

const auth = require('../middleware/auth.middleware');
const requireRole = require('../middleware/role.middleware');

const db = require('../db');


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


// 💰 AGREGAR CRÉDITOS (FIX REAL)
router.post(
  '/add',
  auth,
  requireRole('admin'),
  async (req, res) => {
    try {
      const { userId, amount } = req.body;

      if (!userId || amount === undefined) {
        return res.status(400).json({ error: 'Datos incompletos' });
      }

      const value = parseFloat(amount);

      if (isNaN(value)) {
        return res.status(400).json({ error: 'Monto inválido' });
      }

      await db.query(
        'UPDATE users SET credits = credits + ? WHERE id = ?',
        [value, userId]
      );

      res.json({
        success: true,
        message: 'Créditos agregados correctamente'
      });

    } catch (err) {
      console.error('ERROR ADD:', err);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
);


// ❌ RESTAR CRÉDITOS (FIX)
router.post(
  '/remove',
  auth,
  requireRole('admin'),
  async (req, res) => {
    try {
      const { userId, amount } = req.body;

      const value = parseFloat(amount);

      const [rows] = await db.query(
        'SELECT credits FROM users WHERE id = ?',
        [userId]
      );

      if (!rows.length) {
        return res.status(404).json({ error: 'Usuario no existe' });
      }

      if (rows[0].credits < value) {
        return res.status(400).json({ error: 'Saldo insuficiente' });
      }

      await db.query(
        'UPDATE users SET credits = credits - ? WHERE id = ?',
        [value, userId]
      );

      res.json({
        success: true,
        message: 'Créditos descontados correctamente'
      });

    } catch (err) {
      console.error('ERROR REMOVE:', err);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
);


// 🔥 ACTIVAR SUPER RESELLER (FIX)
router.post(
  '/activar-superreseller',
  auth,
  requireRole('admin'),
  async (req, res) => {
    try {
      const { userId, months } = req.body;

      if (!userId || !months) {
        return res.status(400).json({ error: 'Datos incompletos' });
      }

      const expires = new Date();
      expires.setMonth(expires.getMonth() + months);

      await db.query(`
        UPDATE users 
        SET role = 'super_reseller',
            expires_at = ?
        WHERE id = ?
      `, [expires, userId]);

      res.json({
        success: true,
        message: 'Super Reseller activado correctamente'
      });

    } catch (error) {
      console.error('ERROR SUPER RESELLER:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
);


module.exports = router;