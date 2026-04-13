const db = require("../db");

// =======================
// CREAR DEPÓSITO
// =======================
exports.createDeposit = async (userId, amount) => {
  try {

    if (!userId) {
      throw new Error("Usuario inválido");
    }

    amount = parseFloat(amount);

    if (isNaN(amount) || amount <= 0) {
      throw new Error("Monto inválido");
    }

    const [result] = await db.query(
      "INSERT INTO deposits (user_id, amount, status) VALUES (?, ?, ?)",
      [userId, amount, "pending"]
    );

    return {
      depositId: result.insertId,
      wallet: process.env.USDT_WALLET || "TU_WALLET_USDT_TRC20",
      network: "TRC20"
    };

  } catch (error) {
    console.error("ERROR CREATE DEPOSIT:", error);
    throw error;
  }
};

// =======================
// CONFIRMAR TXID
// =======================
exports.confirmDeposit = async (userId, depositId, txid) => {
  try {

    if (!userId || !depositId || !txid) {
      throw new Error("Datos incompletos");
    }

    const [rows] = await db.query(
      "SELECT * FROM deposits WHERE id = ? AND user_id = ?",
      [depositId, userId]
    );

    if (rows.length === 0) {
      throw new Error("Depósito no encontrado");
    }

    const deposit = rows[0];

    if (deposit.txid) {
      throw new Error("TXID ya registrado");
    }

    if (deposit.status !== "pending") {
      throw new Error("Depósito ya procesado");
    }

    await db.query(
      "UPDATE deposits SET txid = ?, status = ? WHERE id = ?",
      [txid, "waiting", depositId]
    );

    return {
      message: "TXID enviado, en validación"
    };

  } catch (error) {
    console.error("ERROR CONFIRM DEPOSIT:", error);
    throw error;
  }
};

// =======================
// LISTAR DEPÓSITOS
// =======================
exports.getDeposits = async (userId) => {
  try {

    if (!userId) {
      throw new Error("Usuario inválido");
    }

    const [rows] = await db.query(
      `SELECT id, amount, status, txid, created_at 
       FROM deposits 
       WHERE user_id = ? 
       ORDER BY id DESC`,
      [userId]
    );

    return rows;

  } catch (error) {
    console.error("ERROR GET DEPOSITS:", error);
    throw error;
  }
};