const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// =======================
// LOGIN (NO SE TOCA)
// =======================
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const [users] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (users.length === 0) return res.status(400).json({ error: "Usuario no encontrado" });

    const user = users[0];

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: "Contraseña incorrecta" });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "7d" }
    );

    res.json({ token, role: user.role });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error en login" });
  }
};

// =======================
// GENERAR CÓDIGO PRO (6 ALFANUMÉRICO)
// =======================
function generateReferralCode() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";

  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return code;
}

// =======================
// REGISTER (CON REFERIDOS)
// =======================
const register = async (req, res) => {
  try {
    const { email, password, role, ref } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Faltan datos" });
    }

    const hash = await bcrypt.hash(password, 10);

    // 🔥 generar código único
    let referralCode;
    let exists = true;

    while (exists) {
      referralCode = generateReferralCode();
      const [rows] = await db.query(
        "SELECT id FROM users WHERE referral_code = ?",
        [referralCode]
      );
      exists = rows.length > 0;
    }

    // 🔍 verificar referido
    let referredBy = null;

    if (ref) {
      const [refUser] = await db.query(
        "SELECT referral_code FROM users WHERE referral_code = ?",
        [ref]
      );

      if (refUser.length > 0) {
        referredBy = ref;
      }
    }

    // =======================
    // CREAR USUARIO
    // =======================
    await db.query(
      `INSERT INTO users 
      (email, password, role, credits, status, referral_code, referred_by) 
      VALUES (?, ?, ?, 0, 'pending', ?, ?)`,
      [email, hash, role || "reseller", referralCode, referredBy]
    );

    res.json({
      message: "Usuario creado",
      referralCode
    });

  } catch (err) {
    console.error("ERROR REGISTER:", err);
    res.status(500).json({ error: "Error en register" });
  }
};

module.exports = { login, register };