const express = require('express');
const router = express.Router();

const {
  createDeposit,
  confirmDeposit,
  getDeposits
} = require('../controllers/deposit.controller');

// =======================
// DEPÓSITOS
// =======================
router.post('/', createDeposit);
router.post('/confirm', confirmDeposit);
router.get('/', getDeposits);

// =======================
// 🔥 COMPROBANTE (SIN BD)
// =======================
router.post('/payment-proof', async (req, res) => {
  try {

    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email requerido" });
    }

    // 👉 SOLO RESPONDE OK (sin DB)
    console.log("💰 Pago recibido de:", email);

    res.json({ message: "Comprobante recibido" });

  } catch (err) {
    console.error("ERROR FINAL:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;