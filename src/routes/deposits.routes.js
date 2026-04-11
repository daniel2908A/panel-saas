const express = require("express");
const router = express.Router();

const depositController = require("../controllers/deposit.controller");
const auth = require("../middleware/auth.middleware");

// Crear depósito
router.post("/", auth, depositController.createDeposit);

// Confirmar TXID
router.post("/confirm", auth, depositController.confirmDeposit);

// Listar depósitos
router.get("/", auth, depositController.getDeposits);

module.exports = router;