const express = require('express');
const router = express.Router();

const {
  createDeposit,
  confirmDeposit,
  getDeposits
} = require('../controllers/deposit.controller');

const db = require('../db');

// =======================
// DEPÓSITOS
// =======================
router.post('/', createDeposit);
router.post('/confirm', confirmDeposit);
router.get('/', getDeposits);

// =======================
// 🔥 COMPROBANTE SIN ARCHIVO (SOLUCIÓN FINAL)
// =======================
router.post('/payment-proof', async (req, res) => {
  try {

    const email = req.body.email;

    if (!email) {
      return res.status(400).json({ error: "Email requerido" });
    }

    // 👉 marcamos como enviado
    await db.query(
      "UPDATE users SET proof = 'enviado' WHERE email = ?",
      [email]
    );

    res.json({ message: "Comprobante enviado correctamente" });

  } catch (err) {
    console.error("ERROR FINAL:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;