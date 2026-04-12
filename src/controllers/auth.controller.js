const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


// 🔐 LOGIN
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Faltan datos" });
    }

    const [users] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (users.length === 0) {
      return res.status(400).json({ error: "Usuario no encontrado" });
    }

    const user = users[0];

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(400).json({ error: "Contraseña incorrecta" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login exitoso",
      token
    });

  } catch (error) {
    console.error("ERROR LOGIN:", error);
    res.status(500).json({ error: "Error en login" });
  }
};


// 📝 REGISTER (🔥 NUEVO COMPLETO CON REFERIDOS)
const register = async (req, res) => {
  try {
    const { username, email, password, role, referral } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: "Faltan datos" });
    }

    // 🎭 ROLE
    const userRole = ['reseller', 'super_reseller'].includes(role)
      ? role
      : 'reseller';

    // 📧 VERIFICAR EMAIL
    const [existing] = await db.query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (existing.length > 0) {
      return res.status(400).json({ error: "Email ya existe" });
    }

    // 🔐 HASH PASSWORD
    const hashedPassword = await bcrypt.hash(password, 10);

    // 🔗 REFERIDO
    let parentId = null;

    if (referral) {
      const [refUser] = await db.query(
        "SELECT id FROM users WHERE referral_code = ?",
        [referral]
      );

      if (refUser.length > 0) {
        parentId = refUser[0].id;
      }
    }

    // 🧠 SI NO HAY REFERIDO → VA PARA OWNER
    if (!parentId) {
      const [owner] = await db.query(
        "SELECT id FROM users WHERE role = 'owner' LIMIT 1"
      );

      if (owner.length > 0) {
        parentId = owner[0].id;
      }
    }

    // 🎟 GENERAR CÓDIGO DE REFERIDO
    const referralCode = 'REF' + Math.random().toString(36).substring(2, 8).toUpperCase();

    // 💾 INSERT USUARIO
    await db.query(
      `INSERT INTO users (username, email, password, role, credits, parent_id, referral_code)
       VALUES (?, ?, ?, ?, 0, ?, ?)`,
      [username, email, hashedPassword, userRole, parentId, referralCode]
    );

    res.json({
      message: "Usuario registrado",
      role: userRole,
      referralCode
    });

  } catch (error) {
    console.error("ERROR REGISTRO:", error);
    res.status(500).json({ error: error.message });
  }
};


// 🔥 EXPORT
module.exports = {
  login,
  register
};