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

    // Buscar padre
    const [users] = await db.query(
      "SELECT parent_id FROM users WHERE id = ?",
      [userId]
    );

    if (!users.length) {
      return res.json(result); // usuario sin padre
    }

    const parentId = users[0].parent_id;

    // Comisión
    if (parentId && amount > 0) {
      const commission = amount * 0.10;

      await db.query(
        "UPDATE users SET credits = credits + ? WHERE id = ?",
        [commission, parentId]
      );

      console.log(`💸 Comisión ${commission} → usuario ${parentId}`);
    }

    res.json(result);

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