const express = require('express');
const router = express.Router();

const {
  createDeposit,
  confirmDeposit,
  getDeposits
} = require('../controllers/deposit.controller');

const multer = require('multer');
const db = require('../db');
const path = require('path');

// =======================
// CONFIG SUBIDA ARCHIVOS
// =======================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads')); // 🔥 FIX CLAVE
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// =======================
// DEPÓSITOS (SIN CAMBIOS)
// =======================
router.post('/', createDeposit);
router.post('/confirm', confirmDeposit);
router.get('/', getDeposits);

// =======================
// 🔥 SUBIR COMPROBANTE (SIN TOKEN)
// =======================
router.post('/payment-proof', upload.single('file'), async (req, res) => {
  try {

    const email = req.body.email;

    if (!email) {
      return res.status(400).json({ error: "Email requerido" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "No se subió archivo" });
    }

    const filename = req.file.filename;

    await db.query(
      "UPDATE users SET proof = ? WHERE email = ?",
      [filename, email]
    );

    res.json({ message: "Comprobante guardado correctamente" });

  } catch (err) {
    console.error("ERROR REAL:", err); // 🔥 ahora verás el error real
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;