const axios = require("axios");

async function verifyTransaction(txid, expectedAmount) {
  try {
    if (!txid) return false;

    expectedAmount = parseFloat(expectedAmount);
    if (isNaN(expectedAmount) || expectedAmount <= 0) return false;

    const url = `https://apilist.tronscan.org/api/transaction-info?hash=${txid}`;
    const { data } = await axios.get(url, { timeout: 10000 });

    if (!data || !data.contractData) return false;
    if (data.tokenInfo?.symbol !== "USDT") return false;
    if (data.confirmed === false) return false;

    const amount = data.contractData.amount / 1_000_000;
    if (amount < expectedAmount) return false;

    const toAddress = data.contractData.to;
    const expectedWallet = process.env.USDT_WALLET;
    if (expectedWallet && toAddress !== expectedWallet) return false;

    return true;
  } catch (error) {
    console.error("ERROR VERIFY TX:", error.message);
    return false;
  }
}

module.exports = verifyTransaction;