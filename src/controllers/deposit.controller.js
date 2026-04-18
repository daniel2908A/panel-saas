const db = require('../db');

// =============================
// 💸 RECARGA + COMISIONES
// =============================
const createDeposit = async (req, res) => {
  try {

    const { user_id, amount } = req.body;

    if (!user_id || !amount) {
      return res.status(400).json({ error: "Datos incompletos" });
    }

    // quitar 8% comisión
    const credits = amount / 1.08;
    const commission = amount - credits;

    await db.query("START TRANSACTION");

    // sumar créditos
    await db.query(`
      UPDATE users SET credits = credits + ?
      WHERE id = ?
    `, [credits, user_id]);

    // buscar referido
    const [[user]] = await db.query(
      "SELECT referred_by FROM users WHERE id = ?", [user_id]
    );

    let ownerCommission = commission;
    let refCommission = 0;

    if (user.referred_by) {
      refCommission = commission * 0.375; // ~0.3 de 0.8
      ownerCommission = commission - refCommission;

      // pagar referido
      await db.query(`
        UPDATE users 
        SET earnings_referrals = IFNULL(earnings_referrals,0) + ?
        WHERE id = ?
      `, [refCommission, user.referred_by]);
    }

    // pagar owner (ID 1)
    await db.query(`
      UPDATE users 
      SET earnings_referrals = IFNULL(earnings_referrals,0) + ?
      WHERE id = 1
    `, [ownerCommission]);

    await db.query("COMMIT");

    res.json({ success: true });

  } catch (err) {
    await db.query("ROLLBACK");
    console.error(err);
    res.status(500).json({ error: "Error en recarga" });
  }
};

module.exports = {
  createDeposit
};