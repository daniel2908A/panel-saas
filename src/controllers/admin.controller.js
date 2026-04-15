const db = require('../db');
const bcrypt = require('bcryptjs');

// =======================
// CREAR RESELLER
// =======================
exports.createReseller = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: "Faltan datos" });
    }

    const [existing] = await db.query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (existing.length > 0) {
      return res.status(400).json({ error: "Email ya existe" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
      `INSERT INTO users 
      (username, email, password, role, credits, is_active) 
      VALUES (?, ?, ?, 'reseller', 0, 0)`,
      [username, email, hashedPassword]
    );

    res.json({ message: "Reseller creado correctamente" });

  } catch (error) {
    console.error("ERROR CREATE RESELLER:", error);
    res.status(500).json({ error: "Error creando reseller" });
  }
};

// =======================
// LISTAR USUARIOS
// =======================
exports.getAllUsers = async (req, res) => {
  try {
    const [users] = await db.query(
      "SELECT id, username, email, role, credits, is_active FROM users ORDER BY id DESC"
    );

    res.json(users);

  } catch (error) {
    console.error("ERROR GET USERS:", error);
    res.status(500).json({ error: "Error obteniendo usuarios" });
  }
};

// =======================
// 🔥 ACTIVAR USUARIO (FINAL)
// =======================
exports.activateUserPlan = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "Falta userId" });
    }

    await db.query(
      "UPDATE users SET is_active = 1 WHERE id = ?",
      [userId]
    );

    res.json({ message: "Usuario activado correctamente" });

  } catch (error) {
    console.error("ERROR ACTIVAR:", error);
    res.status(500).json({ error: "Error activando usuario" });
  }
};

// =======================
// ELIMINAR USUARIO
// =======================
exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "Falta userId" });
    }

    await db.query(
      "DELETE FROM users WHERE id = ?",
      [userId]
    );

    res.json({ message: "Usuario eliminado correctamente" });

  } catch (error) {
    console.error("ERROR DELETE USER:", error);
    res.status(500).json({ error: "Error eliminando usuario" });
  }
};

// =======================
// CRÉDITOS
// =======================
exports.addCreditsToUser = async (req, res) => {
  try {
    let { userId, amount } = req.body;

    if (!userId || amount === undefined) {
      return res.status(400).json({ error: "Datos incompletos" });
    }

    await db.query(
      "UPDATE users SET credits = credits + ? WHERE id = ?",
      [amount, userId]
    );

    res.json({ message: "Créditos agregados correctamente" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error interno" });
  }
};

exports.removeCreditsFromUser = async (req, res) => {
  try {
    let { userId, amount } = req.body;

    const [users] = await db.query(
      "SELECT credits FROM users WHERE id = ?",
      [userId]
    );

    if (!users.length || users[0].credits < amount) {
      return res.status(400).json({ error: "Saldo insuficiente" });
    }

    await db.query(
      "UPDATE users SET credits = credits - ? WHERE id = ?",
      [amount, userId]
    );

    res.json({ message: "Créditos descontados correctamente" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error interno" });
  }
};