const db = require('../config/db');
const bcrypt = require('bcryptjs');


// 💰 VER CRÉDITOS
exports.getCredits = async (req, res) => {
  try {
    const userId = req.user.id;

    const [rows] = await db.query(
      "SELECT credits FROM users WHERE id = ?",
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.json({ credits: rows[0].credits });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error obteniendo créditos" });
  }
};


// 🔥 DATOS DEL USUARIO
exports.getMe = async (req, res) => {
  try {

    const [user] = await db.query(
      "SELECT id, username, credits, role FROM users WHERE id = ?",
      [req.user.id]
    );

    if (user.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.json(user[0]);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error obteniendo usuario" });
  }
};


// 💸 🔥 HISTORIAL DE COMISIONES
exports.getMyCommissions = async (req, res) => {
  try {
    const userId = req.user.id;

    const [rows] = await db.query(
      `
      SELECT 
        c.amount,
        c.created_at,
        u.username AS from_user
      FROM commissions c
      JOIN users u ON c.from_user = u.id
      WHERE c.user_id = ?
      ORDER BY c.id DESC
      `,
      [userId]
    );

    res.json(rows);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error obteniendo comisiones" });
  }
};


// ➕ AGREGAR CRÉDITOS
exports.addCredits = async (req, res) => {
  try {
    let { userId, amount } = req.body;

    if (!userId || !amount) {
      return res.status(400).json({ error: "Datos incompletos" });
    }

    amount = parseFloat(amount);

    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({ error: "Monto inválido" });
    }

    await db.query(
      "UPDATE users SET credits = credits + ? WHERE id = ?",
      [amount, userId]
    );

    res.json({ message: "Créditos agregados" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error agregando créditos" });
  }
};


// 👥 CLIENTES DEL RESELLER
exports.getMyClients = async (req, res) => {
  try {
    const resellerId = req.user.id;

    const [clients] = await db.query(
      "SELECT id, username, email, credits FROM users WHERE parent_id = ?",
      [resellerId]
    );

    res.json(clients);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error obteniendo clientes" });
  }
};


// 📊 ESTADÍSTICAS DEL RESELLER
exports.getMyStats = async (req, res) => {
  try {
    const resellerId = req.user.id;

    const [result] = await db.query(
      `
      SELECT SUM(orders.total) AS total_sales
      FROM orders
      JOIN users ON orders.user_id = users.id
      WHERE users.parent_id = ?
      `,
      [resellerId]
    );

    res.json({
      total_sales: result[0].total_sales || 0
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error obteniendo estadísticas" });
  }
};


// 👤 CREAR CLIENTE
exports.createClient = async (req, res) => {
  try {
    const resellerId = req.user.id;
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
      (username, email, password, role, parent_id, credits) 
      VALUES (?, ?, ?, 'cliente', ?, 0)`,
      [username, email, hashedPassword, resellerId]
    );

    res.json({ message: "Cliente creado correctamente" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creando cliente" });
  }
};