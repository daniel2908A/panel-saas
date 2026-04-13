const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Faltan datos" });

    const [users] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (users.length === 0) return res.status(400).json({ error: "Usuario no encontrado" });

    const user = users[0];

    let match = false;
    if (user.password && user.password.startsWith("$2")) {
      match = await bcrypt.compare(password, user.password);
    } else {
      match = password === user.password;
    }

    if (!match) return res.status(400).json({ error: "Contraseña incorrecta" });

    // Migración automática a bcrypt si es necesario
    if (user.password && !user.password.startsWith("$2")) {
      const newHash = await bcrypt.hash(password, 10);
      await db.query("UPDATE users SET password = ? WHERE id = ?", [newHash, user.id]);
      console.log("🔄 Password migrada:", user.email);
    }

    // Normalizar el rol en minúscula para evitar problemas de redirección
    const normalizedRole = String(user.role || "").toLowerCase();

    const token = jwt.sign(
      { id: user.id, role: normalizedRole },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "7d" }
    );

    console.log("ROL DEL USER EN LOGIN:", normalizedRole);

    res.json({
      message: "Login exitoso",
      token,
      role: normalizedRole,   // rol normalizado en minúscula
      user: {
        id: user.id,
        role: normalizedRole, // también aquí
        status: user.status || "active"
      }
    });

  } catch (err) {
    console.error("ERROR LOGIN:", err);
    res.status(500).json({ error: "Error en login" });
  }
};

module.exports = { login };