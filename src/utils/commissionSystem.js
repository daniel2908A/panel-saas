const db = require("../db");

async function distributeCommission(buyerId, amount) {
  try {
    let currentUserId = buyerId;

    const levels = [
      { role: "reseller", percent: 0.5 },
      { role: "super_reseller", percent: 0.3 },
      { role: "owner", percent: 0.2 }
    ];

    for (let i = 0; i < levels.length; i++) {
      const [rows] = await db.query(
        "SELECT parent_id FROM user_hierarchy WHERE user_id = ?",
        [currentUserId]
      );

      if (rows.length === 0) break;

      const parentId = rows[0].parent_id;
      const commission = amount * levels[i].percent;

      // 💰 sumar saldo
      await db.query(
        "UPDATE users SET balance = balance + ? WHERE id = ?",
        [commission, parentId]
      );

      // 🧾 registrar comisión
      await db.query(
        "INSERT INTO commissions (user_id, from_user_id, amount, level) VALUES (?, ?, ?, ?)",
        [parentId, buyerId, commission, levels[i].role]
      );

      console.log(`💸 Comisión para ${levels[i].role}: ${commission}`);

      currentUserId = parentId;
    }

  } catch (error) {
    console.error("Error en comisiones:", error);
  }
}

module.exports = distributeCommission;