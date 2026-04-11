const db = require('../config/db');

exports.getDashboard = async (req, res) => {
  const userId = req.user.id;

  try {
    // 💰 TOTAL
    const [totalResult] = await db.query(
      "SELECT SUM(amount) as total FROM commissions WHERE user_id = ?",
      [userId]
    );

    // 📅 HOY
    const [todayResult] = await db.query(
      `SELECT SUM(amount) as today FROM commissions 
       WHERE user_id = ? AND DATE(created_at) = CURDATE()`,
      [userId]
    );

    // 🧾 HISTORIAL
    const [history] = await db.query(
      `SELECT id, amount, level, created_at 
       FROM commissions 
       WHERE user_id = ? 
       ORDER BY created_at DESC LIMIT 10`,
      [userId]
    );

    // 🔥 CLAVE: RETURN
    return res.json({
      total: totalResult[0]?.total || 0,
      today: todayResult[0]?.today || 0,
      history: history || []
    });

  } catch (error) {
    console.error("🔥 ERROR DASHBOARD:", error);

    return res.status(500).json({
      error: "Error interno del servidor"
    });
  }
};