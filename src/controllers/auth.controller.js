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
    console.error(error);
    res.status(500).json({ error: "Error en login" });
  }
};


// 📝 REGISTER
const register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: "Faltan datos" });
    }

    const userRole = ['reseller', 'super_reseller'].includes(role)
      ? role
      : 'reseller';

    const [existing] = await db.query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (existing.length > 0) {
      return res.status(400).json({ error: "Email ya existe" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
      `INSERT INTO users (username, email, password, role, credits)
       VALUES (?, ?, ?, ?, 0)`,
      [username, email, hashedPassword, userRole]
    );

    res.json({
      message: "Usuario registrado",
      role: userRole
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error en registro" });
  }
};


// 🔥 EXPORT CORRECTO (ESTO ARREGLA TODO)
module.exports = {
  login,
  register
};