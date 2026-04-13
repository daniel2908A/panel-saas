const db = require('../db');

// =======================
// PANEL DE GANANCIAS
// =======================
exports.getMyEarnings = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "Usuario no autenticado" });
    }

    // TOTAL
    const [total] = await db.query(
      'SELECT SUM(amount) as total FROM commissions WHERE user_id = ?',
      [userId]
    );

    // HOY
    const [today] = await db.query(
      `SELECT SUM(amount) as total 
       FROM commissions 
       WHERE user_id = ? 
       AND DATE(created_at) = CURDATE()`,
      [userId]
    );

    // POR NIVELES
    const [levels] = await db.query(
      `SELECT level, SUM(amount) as total 
       FROM commissions 
       WHERE user_id = ? 
       GROUP BY level`,
      [userId]
    );

    // HISTORIAL
    const [history] = await db.query(
      `SELECT id, amount, level, created_at 
       FROM commissions 
       WHERE user_id = ? 
       ORDER BY id DESC`,
      [userId]
    );

    res.json({
      total: total[0]?.total || 0,
      today: today[0]?.total || 0,
      levels: levels || [],
      history: history || []
    });

  } catch (error) {
    console.error("ERROR COMMISSIONS:", error);

    res.status(500).json({
      error: "Error obteniendo ganancias"
    });
  }
};