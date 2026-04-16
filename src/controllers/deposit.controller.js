const depositService = require("../services/deposit.service");
const db = require('../db');

// =======================
// CREAR DEPÓSITO
// =======================
exports.createDeposit = async (req, res) => {
  try {
    const userId = req.user?.id;
    let { amount } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "No autorizado" });
    }

    amount = parseFloat(amount);

    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ message: "Monto inválido" });
    }

    const result = await depositService.createDeposit(userId, amount);

    res.json({
      message: "Depósito creado",
      ...result
    });

  } catch (error) {
    console.error("ERROR CREATE DEPOSIT:", error);
    res.status(500).json({ message: "Error creando depósito" });
  }
};

// =======================
// CONFIRMAR DEPÓSITO
// =======================
exports.confirmDeposit = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { depositId, txid } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "No autorizado" });
    }

    if (!depositId || !txid) {
      return res.status(400).json({ message: "Datos incompletos" });
    }

    // Confirmar depósito
    const result = await depositService.confirmDeposit(
      userId,
      depositId,
      txid
    );

    const amount = parseFloat(result.amount) || 0;

    if (amount <= 0) {
      return res.json(result);
    }

    // =========================
    // 💳 SISTEMA NUEVO (8%)
    // =========================

    const total = amount * 1.08;
    const fee = total - amount; // 8%

    const ownerShare = amount * 0.05;     // 5%
    const referralShare = amount * 0.03;  // 3%

    // =========================
    // BUSCAR REFERIDO
    // =========================
    const [users] = await db.query(
      "SELECT referred_by FROM users WHERE id = ?",
      [userId]
    );

    let referredBy = users[0]?.referred_by || null;

    // =========================
    // 💸 SUMAR CRÉDITOS AL USUARIO
    // =========================
    await db.query(
      "UPDATE users SET credits = credits + ? WHERE id = ?",
      [amount, userId]
    );

    // =========================
    // 💰 GANANCIA OWNER
    // =========================
    const OWNER_ID = 1;

    await db.query(
      "UPDATE users SET earnings_sales = earnings_sales + ? WHERE id = ?",
      [referredBy ? ownerShare : fee, OWNER_ID]
    );

    // =========================
    // 👥 GANANCIA REFERIDO
    // =========================
    if (referredBy) {
      await db.query(
        "UPDATE users SET earnings_referrals = earnings_referrals + ? WHERE referral_code = ?",
        [referralShare, referredBy]
      );

      console.log(`💸 Referido gana ${referralShare}`);
    } else {
      console.log(`💸 Owner gana todo: ${fee}`);
    }

    console.log(`
      💳 Recarga: ${amount}
      💰 Fee: ${fee}
      👑 Owner: ${referredBy ? ownerShare : fee}
      👥 Referido: ${referredBy ? referralShare : 0}
    `);

    res.json({
      message: "Depósito confirmado correctamente",
      amount,
      fee,
      ownerShare,
      referralShare
    });

  } catch (error) {
    console.error("ERROR CONFIRM DEPOSIT:", error);
    res.status(500).json({ message: "Error confirmando depósito" });
  }
};

// =======================
// LISTAR DEPÓSITOS
// =======================
exports.getDeposits = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "No autorizado" });
    }

    const deposits = await depositService.getDeposits(userId);

    res.json(deposits);

  } catch (error) {
    console.error("ERROR GET DEPOSITS:", error);
    res.status(500).json({ message: "Error obteniendo depósitos" });
  }
};