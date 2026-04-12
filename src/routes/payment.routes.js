const express = require('express');
const router = express.Router();

const multer = require('multer');
const auth = require('../middleware/auth.middleware');

const upload = multer({ dest: 'uploads/' });

router.post('/upload', auth, upload.single('file'), async (req, res) => {

  const userId = req.user.id;
  const { plan } = req.body;

  // 🔥 guardar en DB
  await req.db.query(
    "INSERT INTO payments (user_id, plan, proof, status) VALUES (?, ?, ?, 'pending')",
    [userId, plan, req.file.filename]
  );

  res.json({ success: true });
});

module.exports = router;