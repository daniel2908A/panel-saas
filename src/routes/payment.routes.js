const express = require('express');
const router = express.Router();

const multer = require('multer');
const auth = require('../middleware/auth.middleware');
const db = require('../db');

// =======================
// MULTER CONFIG
// =======================
const upload = multer({ dest: 'uploads/' });

// =======================
// SUBIR COMPROBANTE
// =======================
router.post('/upload', auth, upload.single('file'), async (req, res) => {
  try {

    const userId = req.user?.id;
    const { plan } = req.body;

    if (!userId) {
      return res.status(401).json({ error: "No autorizado" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "Archivo requerido" });
    }

    if (!plan) {
      return res.status(400).json({ error: "Plan requerido" });
    }

    await db.query(
      "INSERT INTO payments (user_id, plan, proof, status) VALUES (?, ?, ?, 'pending')",
      [userId, plan, req.file.filename]
    );

    res.json({ success: true });

  } catch (err) {
    console.error("ERROR PAYMENT UPLOAD:", err);

    res.status(500).json({
      error: "Error subiendo comprobante"
    });
  }
});

module.exports = router;