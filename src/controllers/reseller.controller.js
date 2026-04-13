const db = require('../db');

// =======================
// PERFIL RESELLER
// =======================
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "No autorizado" });
    }

    const [rows] = await db.query(
      `SELECT id, username, email, role, credits, plan, expires_at 
       FROM users 
       WHERE id = ?`,
      [userId]
    );

    if (!rows.length) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.json(rows[0]);

  } catch (error) {
    console.error("ERROR PROFILE:", error);
    res.status(500).json({ error: "Error obteniendo perfil" });
  }
};

// =======================
// REFERIDOS
// =======================
exports.getReferrals = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "No autorizado" });
    }

    const [rows] = await db.query(
      `SELECT id, username, email, created_at 
       FROM users 
       WHERE parent_id = ? 
       ORDER BY id DESC`,
      [userId]
    );

    res.json(rows);

  } catch (error) {
    console.error("ERROR REFERRALS:", error);
    res.status(500).json({ error: "Error obteniendo referidos" });
  }
};

// =======================
// COMISIONES
// =======================
exports.getCommissions = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "No autorizado" });
    }

    const [rows] = await db.query(
      `SELECT id, amount, level, from_user, created_at 
       FROM commissions 
       WHERE user_id = ? 
       ORDER BY id DESC`,
      [userId]
    );

    res.json(rows);

  } catch (error) {
    console.error("ERROR COMMISSIONS:", error);
    res.status(500).json({ error: "Error obteniendo comisiones" });
  }
};