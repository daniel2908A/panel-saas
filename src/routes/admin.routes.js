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

      // Validaciones
      if (!userId || !amount) {
        return res.status(400).json({ error: 'Datos incompletos' });
      }

      if (amount <= 0) {
        return res.status(400).json({ error: 'Monto inválido' });
      }

      // Verificar que exista el usuario
      const [user] = await db.query(
        'SELECT id FROM users WHERE id = ?',
        [userId]
      );

      if (!user.length) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      // Agregar créditos
      await db.query(
        'UPDATE credits SET balance = balance + ? WHERE user_id = ?',
        [amount, userId]
      );

      // Registrar transacción (opcional pero recomendado)
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


module.exports = router;