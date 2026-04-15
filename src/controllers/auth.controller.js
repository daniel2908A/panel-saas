const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// LOGIN (lo dejamos igual)
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

// 🔥 REGISTER (ESTO FALTABA)
const register = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Faltan datos" });
    }

    const hash = await bcrypt.hash(password, 10);

   await db.query(
  "INSERT INTO users (email, password, role, credits, status) VALUES (?, ?, ?, 0, 'pending')",
      [email, hash, role || "reseller"]
    );

    res.json({ message: "Usuario creado" });

  } catch (err) {
    console.error("ERROR REGISTER:", err);
    res.status(500).json({ error: "Error en register" });
  }
};

module.exports = { login, register };