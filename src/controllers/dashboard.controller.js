const db = require('../db');

exports.getDashboard = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "No autorizado" });
    }

    // 💰 GANANCIAS (sales)
    const [salesResult] = await db.query(
      "SELECT SUM(amount) as total FROM commissions WHERE user_id = ?",
      [userId]
    );

    // 👤 TOTAL USUARIOS (opcional, global)
    const [usersResult] = await db.query(
      "SELECT COUNT(*) as total FROM users"
    );

    // 💳 CRÉDITOS
    const [creditsResult] = await db.query(
      "SELECT credits, plan, expires_at FROM users WHERE id = ?",
      [userId]
    );

    const user = creditsResult[0] || {};

    return res.json({
      sales: salesResult[0]?.total || 0,
      users: usersResult[0]?.total || 0,
      credits: user.credits || 0,
      plan: user.plan || "free",
      expire: user.expires_at || null
    });

  } catch (error) {
    console.error("ERROR DASHBOARD:", error);

    return res.status(500).json({
      error: "Error interno del servidor"
    });
  }
};