const db = require('../db');

// =======================
// CREAR SUSCRIPCIÓN
// =======================
const subscribe = async (req, res) => {
  try {
    const userId = req.user?.id;
    let { plan, amount } = req.body;

    if (!userId) {
      return res.status(401).json({ error: "No autorizado" });
    }

    if (!plan || amount === undefined) {
      return res.status(400).json({ error: "Datos incompletos" });
    }

    amount = parseFloat(amount);

    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({ error: "Monto inválido" });
    }

    // VALIDAR PLANES
    const validPlans = {
      "1m": 30,
      "3m": 90,
      "6m": 180,
      "12m": 365
    };

    if (!validPlans[plan]) {
      return res.status(400).json({ error: "Plan inválido" });
    }

    const days = validPlans[plan];

    // REFERENCIA ÚNICA
    const reference = "PLAN-" + Date.now() + "-" + Math.floor(Math.random() * 1000);

    // INSERT
    const [result] = await db.query(
      `INSERT INTO subscriptions 
      (user_id, plan, amount, reference, status, duration_days)
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

    res.status(500).json({
      error: "Error al crear suscripción"
    });
  }
};

module.exports = {
  subscribe
};