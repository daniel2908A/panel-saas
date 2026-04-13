const axios = require("axios");

async function verifyTransaction(txid, expectedAmount) {
  try {
    if (!txid) {
      console.log("❌ TXID inválido");
      return false;
    }

    expectedAmount = parseFloat(expectedAmount);

    if (isNaN(expectedAmount) || expectedAmount <= 0) {
      console.log("❌ Monto esperado inválido");
      return false;
    }

    const url = `https://apilist.tronscan.org/api/transaction-info?hash=${txid}`;

    const { data } = await axios.get(url, {
      timeout: 10000 // 🔥 evitar cuelgues
    });

    if (!data || !data.contractData) {
      console.log("❌ TX no encontrada");
      return false;
    }

    // =======================
    // VALIDAR TOKEN (USDT TRC20)
    // =======================
    if (data.tokenInfo?.symbol !== "USDT") {
      console.log("❌ No es USDT");
      return false;
    }

    // =======================
    // VALIDAR CONFIRMACIÓN
    // =======================
    if (data.confirmed === false) {
      console.log("⏳ TX no confirmada");
      return false;
    }

    // =======================
    // VALIDAR MONTO
    // =======================
    const amount = data.contractData.amount / 1_000_000;

    console.log("💰 Monto recibido:", amount);

    if (amount < expectedAmount) {
      console.log("❌ Monto insuficiente");
      return false;
    }

    // =======================
    // VALIDAR WALLET DESTINO (MUY IMPORTANTE 🔥)
    // =======================
    const toAddress = data.contractData.to;

    const expectedWallet = process.env.USDT_WALLET;

    if (expectedWallet && toAddress !== expectedWallet) {
      console.log("❌ TX no enviada a tu wallet");
      return false;
    }

    return true;

  } catch (error) {
    console.error("ERROR VERIFY TX:", error.message);
    return false;
  }
}

module.exports = verifyTransaction;