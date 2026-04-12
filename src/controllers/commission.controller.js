const db = require('../db');

// 💰 PANEL DE GANANCIAS
exports.getMyEarnings = async (req, res) => {
  try {
    const userId = req.user.id;

    // 🔹 Total ganado
    const [total] = await db.query(
      'SELECT SUM(amount) as total FROM commissions WHERE user_id = ?',
      [userId]
    );

    // 🔹 Hoy
    const [today] = await db.query(
      `SELECT SUM(amount) as total 
       FROM commissions 
       WHERE user_id = ? 
       AND DATE(created_at) = CURDATE()`,
      [userId]
    );

    // 🔹 Por niveles
    const [levels] = await db.query(
      `SELECT level, SUM(amount) as total 
       FROM commissions 
       WHERE user_id = ? 
       GROUP BY level`,
      [userId]
    );

    // 🔹 Historial
    const [history] = await db.query(
      `SELECT * FROM commissions 
       WHERE user_id = ? 
       ORDER BY id DESC`,
      [userId]
    );

    res.json({
      total: total[0].total || 0,
      today: today[0].total || 0,
      levels,
      history
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};