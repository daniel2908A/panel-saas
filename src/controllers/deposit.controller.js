const depositService = require("../services/deposit.service");
const db = require('../db'); // 🔥 IMPORTANTE

// 🧾 Crear depósito
exports.createDeposit = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ message: "Monto inválido" });
    }

    const result = await depositService.createDeposit(req.user.id, amount);

    res.json({
      message: "Depósito creado",
      ...result
    });

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


// 🔥 CONFIRMAR DEPÓSITO + COMISIONES 💸
exports.confirmDeposit = async (req, res) => {
  try {
    const { depositId, txid } = req.body;

    if (!depositId || !txid) {
      return res.status(400).json({ message: "Datos incompletos" });
    }

    // 🔥 Confirmar depósito (esto acredita al usuario)
    const result = await depositService.confirmDeposit(
      req.user.id,
      depositId,
      txid
    );

    // 💰 MONTO DEL DEPÓSITO
    const amount = result.amount;

    // 🔍 Buscar padre (referido)
    const [users] = await db.query(
      "SELECT parent_id FROM users WHERE id = ?",
      [req.user.id]
    );

    const parentId = users[0]?.parent_id;

    // 💸 Si tiene padre → pagar comisión
    if (parentId) {
      const commission = amount * 0.10; // 🔥 10%

      await db.query(
        "UPDATE users SET credits = credits + ? WHERE id = ?",
        [commission, parentId]
      );

      console.log(`💸 Comisión de ${commission} pagada a usuario ${parentId}`);
    }

    res.json(result);

  } catch (error) {
    console.error("Error confirmDeposit:", error);
    res.status(400).json({ message: error.message });
  }
};


// 📜 Obtener depósitos
exports.getDeposits = async (req, res) => {
  try {
    const deposits = await depositService.getDeposits(req.user.id);
    res.json(deposits);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};