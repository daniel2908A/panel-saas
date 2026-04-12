const db = require('../db');
const bcrypt = require('bcryptjs');


// 👑 CREAR RESELLER
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
      (username, email, password, role, credits) 
      VALUES (?, ?, ?, 'reseller', 0)`,
      [username, email, hashedPassword]
    );

    res.json({ message: "Reseller creado correctamente" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creando reseller" });
  }
};


// 👥 LISTAR USUARIOS
exports.getAllUsers = async (req, res) => {
  try {
    const [users] = await db.query(
      "SELECT id, username, email, role, credits FROM users ORDER BY id DESC"
    );

    res.json(users);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error obteniendo usuarios" });
  }
};


// 💰 AGREGAR CRÉDITOS
exports.addCreditsToUser = async (req, res) => {
  try {
    let { userId, amount } = req.body;

    if (!userId || amount === undefined) {
      return res.status(400).json({ error: "Datos incompletos" });
    }

    userId = parseInt(userId);
    amount = parseFloat(amount);

    if (isNaN(userId) || isNaN(amount)) {
      return res.status(400).json({ error: "Datos inválidos" });
    }

    await db.query(
      "UPDATE users SET credits = credits + ? WHERE id = ?",
      [amount, userId]
    );

    res.json({ message: "Créditos agregados correctamente" });

  } catch (error) {
    console.error("ERROR ADD CREDITS:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};


// ❌ RESTAR CRÉDITOS
exports.removeCreditsFromUser = async (req, res) => {
  try {
    let { userId, amount } = req.body;

    userId = parseInt(userId);
    amount = parseFloat(amount);

    const [users] = await db.query(
      "SELECT credits FROM users WHERE id = ?",
      [userId]
    );

    if (!users.length) {
      return res.status(404).json({ error: "Usuario no existe" });
    }

    if (users[0].credits < amount) {
      return res.status(400).json({ error: "Saldo insuficiente" });
    }

    await db.query(
      "UPDATE users SET credits = credits - ? WHERE id = ?",
      [amount, userId]
    );

    res.json({ message: "Créditos descontados correctamente" });

  } catch (error) {
    console.error("ERROR REMOVE CREDITS:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};


// 🔥 ACTIVAR SUSCRIPCIÓN (LO QUE TE FALTABA)
exports.activateUserPlan = async (req, res) => {
  try {
    const { email, plan } = req.body;

    if (!email || !plan) {
      return res.status(400).json({ error: "Datos incompletos" });
    }

    let months = 1;

    if (plan === "3m") months = 3;
    if (plan === "6m") months = 6;
    if (plan === "12m") months = 12;

    const expireDate = new Date();
    expireDate.setMonth(expireDate.getMonth() + months);

    await db.query(
      "UPDATE users SET plan = ?, expires_at = ? WHERE email = ?",
      [plan, expireDate, email]
    );

    res.json({ message: "Plan activado correctamente" });

  } catch (error) {
    console.error("ERROR PLAN:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};


// ❌ ELIMINAR USUARIO
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

    res.json({ message: "Usuario eliminado" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error eliminando usuario" });
  }
};


// 📊 ESTADÍSTICAS
exports.getStats = async (req, res) => {
  try {

    const [users] = await db.query(
      "SELECT COUNT(*) as total FROM users"
    );

    const [credits] = await db.query(
      "SELECT SUM(credits) as total FROM users"
    );

    res.json({
      users: users[0].total || 0,
      credits: credits[0].total || 0
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error obteniendo estadísticas" });
  }
};