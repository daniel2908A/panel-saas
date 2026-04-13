const db = require('../db');

exports.processCommissions = async (conn, userId, amount) => {
  try {

    if (!conn) {
      throw new Error("No hay conexión de base de datos");
    }

    amount = parseFloat(amount);

    if (isNaN(amount) || amount <= 0) {
      console.log("⚠️ Monto inválido para comisiones");
      return;
    }

    let currentUserId = userId;

    // Niveles de comisión
    const levels = [0.10, 0.05, 0.02];

    for (let i = 0; i < levels.length; i++) {

      const [users] = await conn.query(
        'SELECT parent_id FROM users WHERE id = ?',
        [currentUserId]
      );

      if (!users.length || !users[0].parent_id) {
        break;
      }

      const referrerId = users[0].parent_id;

      const commission = amount * levels[i];

      if (commission <= 0) continue;

      // =======================
      // SUMAR CRÉDITOS
      // =======================
      await conn.query(
        'UPDATE users SET credits = credits + ? WHERE id = ?',
        [commission, referrerId]
      );

      // =======================
      // HISTORIAL
      // =======================
      await conn.query(
        `INSERT INTO commissions 
        (user_id, from_user, amount, level) 
        VALUES (?, ?, ?, ?)`,
        [referrerId, userId, commission, i + 1]
      );

      currentUserId = referrerId;
    }

  } catch (error) {
    console.error("ERROR PROCESS COMMISSIONS:", error);
    throw error; // importante para rollback
  }
};