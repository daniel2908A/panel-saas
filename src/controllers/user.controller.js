const db = require('../db');

// =======================
// LISTAR USUARIOS
// =======================
const getUsers = async (req, res) => {
  try {
    const [users] = await db.query("SELECT * FROM users");
    res.json(users);
  } catch (err) {
    console.error("ERROR REAL:", err);
    res.status(500).json({ error: "Error cargando usuarios" });
  }
};

// =======================
// OBTENER USUARIO LOGUEADO (FIX COMPLETO)
// =======================
const getMe = async (req, res) => {
  try {
    const userId = req.user.id;

    const [rows] = await db.query(
      `SELECT 
        id,
        email,
        role,
        credits,
        status,
        referral_code,
        earnings_sales,
        earnings_referrals
      FROM users 
      WHERE id = ?`,
      [userId]
    );

    if (!rows.length) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.json(rows[0]);

  } catch (error) {
    console.error("ERROR GET ME:", error);
    res.status(500).json({ error: "Error obteniendo usuario" });
  }
};

module.exports = { getUsers, getMe };