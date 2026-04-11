const db = require("../db");

// 🧾 Crear depósito
exports.createDeposit = async (userId, amount) => {
  const [result] = await db.query(
    "INSERT INTO deposits (user_id, amount, status) VALUES (?, ?, ?)",
    [userId, amount, "pending"]
  );

  return {
    depositId: result.insertId,
    wallet: "TU_WALLET_USDT_TRC20",
    network: "TRC20"
  };
};


// 🔍 Confirmar TXID
exports.confirmDeposit = async (userId, depositId, txid) => {
  const [rows] = await db.query(
    "SELECT * FROM deposits WHERE id = ? AND user_id = ?",
    [depositId, userId]
  );

  if (rows.length === 0) {
    throw new Error("Depósito no encontrado");
  }

  if (rows[0].txid) {
    throw new Error("TXID ya registrado");
  }

  await db.query(
    "UPDATE deposits SET txid = ?, status = ? WHERE id = ?",
    [txid, "waiting", depositId]
  );

  return { message: "TXID enviado, en validación" };
};


// 📜 Obtener depósitos
exports.getDeposits = async (userId) => {
  const [rows] = await db.query(
    "SELECT * FROM deposits WHERE user_id = ? ORDER BY id DESC",
    [userId]
  );

  return rows;
};