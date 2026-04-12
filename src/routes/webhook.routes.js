const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/binance', async (req, res) => {
  try {

    console.log("Webhook recibido:", req.body);

    // 🔥 IMPORTANTE: Binance envía datos aquí
    const data = req.body;

    // 👉 ajusta según Binance real
    const memo = data?.memo || "";

    if (!memo.includes("|")) {
      return res.json({ message: "Formato inválido" });
    }

    const [email, plan] = memo.split("|");

    let months = 1;

    if (plan === "3m") months = 3;
    if (plan === "6m") months = 6;
    if (plan === "12m") months = 12;

    await db.query(`
      UPDATE users 
      SET 
        status = 'active',
        plan = ?,
        expires_at = DATE_ADD(NOW(), INTERVAL ? MONTH)
      WHERE email = ?
    `, [plan, months, email]);

    console.log("Usuario activado:", email);

    res.json({ success: true });

  } catch (err) {
    console.error("Webhook error:", err);
    res.status(500).json({ error: "Error webhook" });
  }
});

module.exports = router;