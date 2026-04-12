const db = require('../db');

// 📦 CREAR SUSCRIPCIÓN
const subscribe = async (req, res) => {
  try {
    const userId = req.user.id;
    const { plan, amount } = req.body;

    if (!plan || !amount) {
      return res.status(400).json({ error: "Datos incompletos" });
    }

    // 🔥 GENERAR REFERENCIA ÚNICA
    const reference = "PLAN-" + Date.now();

    // 📅 CALCULAR DURACIÓN
    let days = 30;

    if (plan === "3m") days = 90;
    if (plan === "6m") days = 180;
    if (plan === "12m") days = 365;

    // 📝 GUARDAR EN DB
    const [result] = await db.query(
      `INSERT INTO subscriptions (user_id, plan, amount, reference, status, duration_days)
       VALUES (?, ?, ?, ?, 'pending', ?)`,
      [userId, plan, amount, reference, days]
    );

    res.json({
      success: true,
      id: result.insertId,
      reference
    });

  } catch (error) {
    console.error("ERROR SUBSCRIBE:", error);
    res.status(500).json({ error: "Error al crear suscripción" });
  }
};

module.exports = {
  subscribe
};