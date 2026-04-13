const db = require('../db');

async function processCommission(userId, amount) {
  try {
    // =======================
    // VALIDACIONES
    // =======================
    if (!userId) {
      console.log("⚠️ userId inválido");
      return;
    }

    amount = parseFloat(amount);

    if (isNaN(amount) || amount <= 0) {
      console.log("⚠️ monto inválido");
      return;
    }

    // =======================
    // CONFIG COMISIONES
    // =======================
    const totalPercent = 0.08; // 8%
    const superPercent = 0.03; // 3%
    const ownerPercent = 0.05; // 5%

    let ownerAmount = amount * totalPercent;

    // =======================
    // BUSCAR PADRE
    // =======================
    const [users] = await db.query(
      "SELECT parent_id FROM users WHERE id = ?",
      [userId]
    );

    if (!users.length) return;

    const parentId = users[0].parent_id;

    // =======================
    // SUPER RESELLER
    // =======================
    if (parentId) {
      const [parent] = await db.query(
        "SELECT id, role FROM users WHERE id = ?",
        [parentId]
      );

      if (parent.length && parent[0].role === 'super_reseller') {

        const superAmount = amount * superPercent;
        ownerAmount = amount * ownerPercent;

        await db.query(
          "UPDATE users SET credits = credits + ? WHERE id = ?",
          [superAmount, parentId]
        );

        await db.query(
          `INSERT INTO commissions (user_id, from_user, amount, level) 
           VALUES (?, ?, ?, ?)`,
          [parentId, userId, superAmount, 1]
        );

        console.log(`💸 Super reseller gana ${superAmount}`);
      }
    }

    // =======================
    // OWNER
    // =======================
    const [owner] = await db.query(
      "SELECT id FROM users WHERE role = 'owner' LIMIT 1"
    );

    if (owner.length) {
      await db.query(
        "UPDATE users SET credits = credits + ? WHERE id = ?",
        [ownerAmount, owner[0].id]
      );

      await db.query(
        `INSERT INTO commissions (user_id, from_user, amount, level) 
         VALUES (?, ?, ?, ?)`,
        [owner[0].id, userId, ownerAmount, 0]
      );

      console.log(`💰 Owner gana ${ownerAmount}`);
    }

  } catch (err) {
    console.error("ERROR PROCESS COMMISSION:", err);
  }
}

module.exports = processCommission;