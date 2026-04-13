const db = require('../db');

exports.getDashboard = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) return res.status(401).json({ error: "No autorizado" });

    // 💰 GANANCIAS (comisiones del usuario)
    const [salesResult] = await db.query(
      "SELECT SUM(amount) as total FROM commissions WHERE user_id = ?",
      [userId]
    );

    // 👤 TOTAL USUARIOS
    const [usersResult] = await db.query(
      "SELECT COUNT(*) as total FROM users"
    );

    // 💳 CRÉDITOS, PLAN Y EXPIRACIÓN
    const [creditsResult] = await db.query(
      "SELECT credits, plan, expires_at FROM users WHERE id = ?",
      [userId]
    );

    const user = creditsResult[0] || {};

    res.json({
      sales: salesResult[0]?.total || 0,
      users: usersResult[0]?.total || 0,
      credits: user.credits || 0,
      plan: user.plan || "free",
      expire: user.expires_at || null
    });

  } catch (error) {
    console.error("ERROR DASHBOARD:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};