const express = require('express');
const router = express.Router();
const db = require('../db');

// =======================
// WEBHOOK BINANCE
// =======================
router.post('/binance', async (req, res) => {
  try {

    console.log("📩 Webhook recibido:", req.body);

    const data = req.body || {};

    // VALIDAR MEMO
    const memo = data.memo || "";

    if (!memo || !memo.includes("|")) {
      return res.json({ message: "Formato inválido" });
    }

    const [email, plan] = memo.split("|");

    if (!email || !plan) {
      return res.json({ message: "Datos incompletos" });
    }

    // VALIDAR PLAN
    const plans = {
      "1m": 1,
      "3m": 3,
      "6m": 6,
      "12m": 12
    };

    if (!plans[plan]) {
      return res.json({ message: "Plan inválido" });
    }

    const months = plans[plan];

    // VALIDAR USUARIO
    const [users] = await db.query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (!users.length) {
      console.log("⚠️ Usuario no encontrado:", email);
      return res.json({ message: "Usuario no existe" });
    }

    // ACTUALIZAR
    await db.query(`
      UPDATE users 
      SET 
        status = 'active',
        plan = ?,
        expires_at = DATE_ADD(NOW(), INTERVAL ? MONTH)
      WHERE email = ?
    `, [plan, months, email]);

    console.log("✅ Usuario activado:", email);

    res.json({ success: true });

  } catch (err) {
    console.error("❌ Webhook error:", err);

    res.status(500).json({
      error: "Error webhook"
    });
  }
});

module.exports = router;