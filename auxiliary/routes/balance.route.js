const express = require("express");
const balanceController = require("../controllers/balance.controller");

const router = express.Router();

router.get('/', balanceController.getBalanceP);
router.get('/recharge', balanceController.recharge);

module.exports = router;