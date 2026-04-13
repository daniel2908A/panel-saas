const db = require('../db');

exports.getDashboard = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      console.error("Dashboard: req.user o req.user.id no definido");
      return res.status(401).json({ error: "No autorizado" });
    }

    const userId = req.user.id;
    console.log("Dashboard: userId =", userId);

    // 💰 Ganancias del usuario (comisiones)
    let salesResult = [];
    try {
      [salesResult] = await db.query(
        "SELECT IFNULL(SUM(amount), 0) as total FROM commissions WHERE user_id = ?",
        [userId]
      );
      console.log("Dashboard: salesResult =", salesResult);
    } catch (err) {
      console.error("Error al obtener comisiones:", err.message);
      salesResult = [{ total: 0 }];
    }

    // 👤 Total de usuarios
    let usersResult = [];
    try {
      [usersResult] = await db.query(
        "SELECT COUNT(*) as total FROM users"
      );
      console.log("Dashboard: usersResult =", usersResult);
    } catch (err) {
      console.error("Error al contar usuarios:", err.message);
      usersResult = [{ total: 0 }];
    }

    // 💳 Créditos, plan y expiración del usuario
    let creditsResult = [];
    try {
      [creditsResult] = await db.query(
        "SELECT credits, plan, expires_at FROM users WHERE id = ?",
        [userId]
      );
      console.log("Dashboard: creditsResult =", creditsResult);
    } catch (err) {
      console.error("Error al obtener créditos/plan:", err.message);
      creditsResult = [{ credits: 0, plan: "free", expires_at: null }];
    }

    const user = creditsResult[0] || {};

    res.json({
      sales: salesResult[0]?.total || 0,
      users: usersResult[0]?.total || 0,
      credits: user.credits || 0,
      plan: user.plan || "free",
      expire: user.expires_at || null
    });

  } catch (error) {
    console.error("ERROR DASHBOARD GENERAL:", error.message);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};