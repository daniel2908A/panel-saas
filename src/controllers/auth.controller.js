const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 🔧 GENERAR CÓDIGO DE REFERIDO
function generateRefCode(username) {
  return username + Math.floor(1000 + Math.random() * 9000);
}

// 🔐 LOGIN
exports.login = async (req, res) => {
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
      {
        id: user.id,
        role: user.role
      },
      process.env.JWT_SECRET || "secretkey",
      {
        expiresIn: "7d"
      }
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


// 📝 REGISTRO CON REFERIDOS 🔥
exports.register = async (req, res) => {
  try {
    const { username, email, password, ref } = req.body;

    // 🔎 validar
    if (!username || !email || !password) {
      return res.status(400).json({ error: "Faltan datos" });
    }

    // 🔎 verificar duplicado
    const [existing] = await db.query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (existing.length > 0) {
      return res.status(400).json({ error: "Email ya existe" });
    }

    // 🔐 hash
    const hashedPassword = await bcrypt.hash(password, 10);

    // 🔥 generar código propio
    const refCode = generateRefCode(username);

    // 🔗 buscar referido
    let parentId = null;

    if (ref) {
      const [refUser] = await db.query(
        "SELECT id FROM users WHERE ref_code = ?",
        [ref]
      );

      if (refUser.length > 0) {
        parentId = refUser[0].id;
      }
    }

    // 👤 crear usuario
    await db.query(
      `INSERT INTO users 
      (username, email, password, role, credits, ref_code, parent_id) 
      VALUES (?, ?, ?, 'cliente', 0, ?, ?)`,
      [username, email, hashedPassword, refCode, parentId]
    );

    res.json({
      message: "Usuario registrado correctamente",
      ref_code: refCode
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error en registro" });
  }
};