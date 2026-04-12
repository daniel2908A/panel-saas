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


// 💰 AGREGAR CRÉDITOS (MANUAL ADMIN)
router.post(
  '/add',
  auth,
  requireRole('admin'),
  async (req, res) => {
    try {
      const { userId, amount } = req.body;

      if (!userId || !amount) {
        return res.status(400).json({ error: 'Datos incompletos' });
      }

      if (amount <= 0) {
        return res.status(400).json({ error: 'Monto inválido' });
      }

      const [user] = await db.query(
        'SELECT id FROM users WHERE id = ?',
        [userId]
      );

      if (!user.length) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      await db.query(
        'UPDATE credits SET balance = balance + ? WHERE user_id = ?',
        [amount, userId]
      );

      await db.query(
        'INSERT INTO credit_transactions (user_id, amount, type, description) VALUES (?, ?, ?, ?)',
        [userId, amount, 'add', 'Recarga manual por admin']
      );

      res.json({
        success: true,
        message: 'Créditos agregados correctamente'
      });

    } catch (err) {
      console.error('Error en /add:', err);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
);


// ❌ RESTAR CRÉDITOS
router.post(
  '/remove',
  auth,
  requireRole('admin'),
  async (req, res) => {
    try {
      const { userId, amount } = req.body;

      if (!userId || !amount) {
        return res.status(400).json({ error: 'Datos incompletos' });
      }

      if (amount <= 0) {
        return res.status(400).json({ error: 'Monto inválido' });
      }

      const [rows] = await db.query(
        'SELECT balance FROM credits WHERE user_id = ?',
        [userId]
      );

      if (!rows.length) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      const current = rows[0].balance;

      if (current < amount) {
        return res.status(400).json({ error: 'Saldo insuficiente' });
      }

      await db.query(
        'UPDATE credits SET balance = balance - ? WHERE user_id = ?',
        [amount, userId]
      );

      await db.query(
        'INSERT INTO credit_transactions (user_id, amount, type, description) VALUES (?, ?, ?, ?)',
        [userId, amount, 'remove', 'Descuento manual por admin']
      );

      res.json({
        success: true,
        message: 'Créditos descontados correctamente'
      });

    } catch (err) {
      console.error('Error en /remove:', err);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
);


// 🔥 ACTIVAR SUPER RESELLER CON TIEMPO
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
        SET role = 'superreseller',
            plan_expires_at = ?
        WHERE id = ?
      `, [expires, userId]);

      res.json({
        success: true,
        message: 'Super Reseller activado correctamente'
      });

    } catch (error) {
      console.error('Error en activar-superreseller:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
);


module.exports = router;