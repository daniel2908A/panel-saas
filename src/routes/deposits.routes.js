const express = require('express');
const router = express.Router();

const {
  createDeposit,
  confirmDeposit,
  getDeposits
} = require('../controllers/deposit.controller');

const auth = require('../middleware/auth.middleware');
const multer = require('multer');
const db = require('../db');

// =======================
// CONFIG SUBIDA ARCHIVOS
// =======================
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// =======================
// DEPÓSITOS
// =======================

// CREAR
router.post('/', auth, createDeposit);

// CONFIRMAR
router.post('/confirm', auth, confirmDeposit);

// LISTAR
router.get('/', auth, getDeposits);

// =======================
// 🔥 NUEVO: SUBIR COMPROBANTE
// =======================
router.post('/payment-proof', auth, upload.single('file'), async (req, res) => {
  try {
    const userId = req.user.id;

    if (!req.file) {
      return res.status(400).json({ error: "No se subió archivo" });
    }

    const filename = req.file.filename;

    await db.query(
      "UPDATE users SET proof = ? WHERE id = ?",
      [filename, userId]
    );

    res.json({ message: "Comprobante guardado correctamente" });

  } catch (err) {
    console.error("ERROR SUBIENDO COMPROBANTE:", err);
    res.status(500).json({ error: "Error subiendo comprobante" });
  }
});

module.exports = router;