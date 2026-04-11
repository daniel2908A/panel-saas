const db = require('../config/db');

exports.processCommissions = async (conn, userId, amount) => {
  let currentUserId = userId;

  const levels = [0.10, 0.05, 0.02];

  for (let i = 0; i < levels.length; i++) {
    const [users] = await conn.query(
      'SELECT referred_by FROM users WHERE id = ?',
      [currentUserId]
    );

    if (!users.length || !users[0].referred_by) break;

    const referrerId = users[0].referred_by;
    const commission = amount * levels[i];

    // 💰 SUMAR CRÉDITOS
    await conn.query(
      'UPDATE users SET credits = credits + ? WHERE id = ?',
      [commission, referrerId]
    );

    // 🧾 (opcional pero PRO) guardar historial
    await conn.query(
      'INSERT INTO commissions (user_id, from_user_id, amount, level) VALUES (?, ?, ?, ?)',
      [referrerId, userId, commission, i + 1]
    );

    currentUserId = referrerId;
  }
};