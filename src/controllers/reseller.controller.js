const db = require('../config/db');

// 🔹 Obtener perfil reseller
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const [rows] = await db.query(
      "SELECT id, username, email, credits, role FROM users WHERE id = ?",
      [userId]
    );

    res.json(rows[0]);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener perfil" });
  }
};


// 🔹 Obtener referidos
exports.getReferrals = async (req, res) => {
  try {
    const userId = req.user.id;

    const [rows] = await db.query(
      "SELECT id, username, email, credits FROM users WHERE parent_id = ?",
      [userId]
    );

    res.json(rows);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener referidos" });
  }
};


// 🔹 Obtener comisiones
exports.getCommissions = async (req, res) => {
  try {
    const userId = req.user.id;

    const [rows] = await db.query(
      "SELECT * FROM commissions WHERE user_id = ? ORDER BY created_at DESC",
      [userId]
    );

    res.json(rows);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener comisiones" });
  }
};