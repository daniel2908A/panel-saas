const express = require('express');
const router = express.Router();

// ⚠️ IMPORTANTE: importar bien
const depositController = require('../controllers/deposit.controller');

// =======================
// DEPÓSITO / RECARGA
// =======================
router.post('/', depositController.createDeposit);

// =======================
// COMPROBANTE SIMPLE
// =======================
router.post('/payment-proof', async (req, res) => {
  try {

    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email requerido" });
    }

    console.log("💰 Pago recibido de:", email);

    res.json({ message: "Comprobante recibido" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error interno" });
  }
});

module.exports = router;