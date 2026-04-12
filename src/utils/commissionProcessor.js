const db = require('../db');

async function processCommission(userId, amount) {
  try {
    const total = amount * 0.08;

    let ownerAmount = total;

    const [user] = await db.query(
      "SELECT parent_id FROM users WHERE id = ?",
      [userId]
    );

    if (user.length === 0) return;

    const parentId = user[0].parent_id;

    if (parentId) {
      const [parent] = await db.query(
        "SELECT id, role FROM users WHERE id = ?",
        [parentId]
      );

      if (parent.length > 0 && parent[0].role === 'super_reseller') {
        const superAmount = amount * 0.03;
        ownerAmount = amount * 0.05;

        await db.query(
          "UPDATE users SET balance = balance + ? WHERE id = ?",
          [superAmount, parentId]
        );
      }
    }

    const [owner] = await db.query(
      "SELECT id FROM users WHERE role = 'owner' LIMIT 1"
    );

    if (owner.length > 0) {
      await db.query(
        "UPDATE users SET balance = balance + ? WHERE id = ?",
        [ownerAmount, owner[0].id]
      );
    }

    console.log("💸 Comisión aplicada");

  } catch (err) {
    console.error("Error comisión:", err);
  }
}

module.exports = processCommission;