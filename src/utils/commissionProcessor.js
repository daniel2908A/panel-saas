const db = require('../config/db');

async function processCommission(userId, amount) {
  try {
    const totalCommission = amount * 0.08;

    let ownerAmount = totalCommission;
    let superAmount = 0;

    // 🔎 Buscar usuario
    const [users] = await db.query(
      "SELECT parent_id FROM users WHERE id = ?",
      [userId]
    );

    if (users.length === 0) return;

    const parentId = users[0].parent_id;

    if (parentId) {
      const [parent] = await db.query(
        "SELECT id, role FROM users WHERE id = ?",
        [parentId]
      );

      if (parent.length > 0 && parent[0].role === 'super_reseller') {
        superAmount = amount * 0.03;
        ownerAmount = amount * 0.05;

        // 💰 Pagar super reseller
        await db.query(
          "UPDATE users SET credits = credits + ? WHERE id = ?",
          [superAmount, parentId]
        );

        await db.query(
          "INSERT INTO commissions (user_id, amount, type) VALUES (?, ?, ?)",
          [parentId, superAmount, 'super_reseller']
        );
      }
    }

    // 👑 OWNER
    const [owner] = await db.query(
      "SELECT id FROM users WHERE role = 'owner' LIMIT 1"
    );

    if (owner.length > 0) {
      await db.query(
        "UPDATE users SET credits = credits + ? WHERE id = ?",
        [ownerAmount, owner[0].id]
      );

      await db.query(
        "INSERT INTO commissions (user_id, amount, type) VALUES (?, ?, ?)",
        [owner[0].id, ownerAmount, 'owner']
      );
    }

    console.log("💸 Comisión aplicada correctamente");

  } catch (err) {
    console.error("Error en comisión:", err);
  }
}

module.exports = processCommission;