const db = require('../db');

exports.getDashboard = async (req, res) => {
  try {
    // Validar que req.user exista
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "No autorizado" });
    }

    const userId = req.user.id;

    // 💰 Ganancias del usuario (comisiones)
    const [salesResult] = await db.query(
      "SELECT IFNULL(SUM(amount), 0) as total FROM commissions WHERE user_id = ?",
      [userId]
    );

    // 👤 Total de usuarios
    const [usersResult] = await db.query(
      "SELECT COUNT(*) as total FROM users"
    );

    // 💳 Créditos, plan y expiración del usuario
    const [creditsResult] = await db.query(
      "SELECT credits, plan, expires_at FROM users WHERE id = ?",
      [userId]
    );

    const user = creditsResult[0] || {};

    // Responder con valores por defecto si son nulos
    res.json({
      sales: salesResult[0]?.total || 0,
      users: usersResult[0]?.total || 0,
      credits: user.credits || 0,
      plan: user.plan || "free",
      expire: user.expires_at || null
    });

  } catch (error) {
    console.error("ERROR DASHBOARD:", error.message);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};