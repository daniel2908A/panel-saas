const axios = require("axios");

async function verifyTransaction(txid, expectedAmount) {
  try {
    const url = `https://apilist.tronscan.org/api/transaction-info?hash=${txid}`;
    const { data } = await axios.get(url);

    if (!data || !data.contractData) return false;

    // Validar que sea USDT (TRC20)
    if (data.tokenInfo?.symbol !== "USDT") {
      console.log("❌ No es USDT");
      return false;
    }

    const amount = data.contractData.amount / 1_000_000;

    console.log("Monto recibido:", amount);

    // Validar confirmaciones (mínimo 1)
    if (data.confirmed === false) {
      console.log("⏳ TX no confirmada");
      return false;
    }

    return amount >= expectedAmount;

  } catch (error) {
    console.error("Error verificando TX:", error.message);
    return false;
  }
}

module.exports = verifyTransaction;