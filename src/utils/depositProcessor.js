const db = require("../db");
const verifyTransaction = require("./verifyTx");

// 🔥 USAR SOLO ESTE (EL BUENO)
const { processCommissions } = require("./commission.service");

async function processDeposits() {
  try {

    const [deposits] = await db.query(
      "SELECT * FROM deposits WHERE status = 'waiting' AND txid IS NOT NULL"
    );

    for (const dep of deposits) {

      try {
        console.log("🔍 Verificando depósito:", dep.id);

        // =======================
        // VALIDAR ESTADO
        // =======================
        if (dep.status !== "waiting") continue;

        // =======================
        // EVITAR TXID DUPLICADO
        // =======================
        const [existing] = await db.query(
          "SELECT id FROM deposits WHERE txid = ? AND id != ?",
          [dep.txid, dep.id]
        );

        if (existing.length > 0) {
          console.log("❌ TXID duplicado");

          await db.query(
            "UPDATE deposits SET status = 'rejected' WHERE id = ?",
            [dep.id]
          );

          continue;
        }

        // =======================
        // VALIDAR TRANSACCIÓN
        // =======================
        const isValid = await verifyTransaction(dep.txid, dep.amount);

        if (!isValid) {
          console.log("❌ TX inválida");
          continue;
        }

        // =======================
        // APROBAR DEPÓSITO
        // =======================
        await db.query(
          "UPDATE deposits SET status = 'approved' WHERE id = ?",
          [dep.id]
        );

        // =======================
        // SUMAR CRÉDITOS
        // =======================
        await db.query(
          "UPDATE users SET credits = credits + ? WHERE id = ?",
          [dep.amount, dep.user_id]
        );

        console.log(`💰 Depósito aprobado ID ${dep.id}`);

        // =======================
        // COMISIONES
        // =======================
        const conn = await db.getConnection();

        try {
          await conn.beginTransaction();

          await processCommissions(conn, dep.user_id, dep.amount);

          await conn.commit();

        } catch (err) {
          await conn.rollback();
          console.error("❌ Error comisiones:", err);
        } finally {
          conn.release();
        }

      } catch (err) {
        console.error(`❌ Error procesando depósito ${dep.id}:`, err);
      }
    }

  } catch (error) {
    console.error("💥 Error global depósitos:", error);
  }
}

module.exports = processDeposits;