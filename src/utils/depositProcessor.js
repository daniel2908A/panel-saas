const db = require("../db");
const verifyTransaction = require("./verifyTx");

async function processDeposits() {
  try {
    const [deposits] = await db.query(
      "SELECT * FROM deposits WHERE status = 'pending' AND txid IS NOT NULL"
    );

    for (const dep of deposits) {
      console.log("🔍 Verificando depósito:", dep.id);

      // 🔒 Validar que no esté ya aprobado
      if (dep.status === "approved") {
        console.log("⚠️ Ya aprobado, saltando...");
        continue;
      }

      // 🔒 Evitar TXID duplicado
      const [existing] = await db.query(
        "SELECT id FROM deposits WHERE txid = ? AND id != ?",
        [dep.txid, dep.id]
      );

      if (existing.length > 0) {
        console.log("❌ TXID duplicado detectado");

        await db.query(
          "UPDATE deposits SET status = 'rejected' WHERE id = ?",
          [dep.id]
        );

        continue;
      }

      const isValid = await verifyTransaction(dep.txid, dep.amount);

      if (!isValid) {
        console.log("❌ TX inválida o monto incorrecto");
        continue;
      }

      // ✅ Aprobar depósito
      await db.query(
        "UPDATE deposits SET status = 'approved' WHERE id = ?",
        [dep.id]
      );

      // 💰 SUMAR SALDO
      await db.query(
        "UPDATE users SET balance = balance + ? WHERE id = ?",
        [dep.amount, dep.user_id]
      );

      console.log(`💰 Depósito aprobado ID ${dep.id}`);
    }

  } catch (error) {
    console.error("💥 Error procesando depósitos:", error);
  }
}

module.exports = processDeposits;