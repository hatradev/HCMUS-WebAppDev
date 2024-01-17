const express = require("express");
const paymentController = require("../controllers/payment.controller");

const router = express.Router();

router.get('/getPayment', paymentController.getPayment);
router.get('/authenticate', paymentController.paymentAuthenticate);
router.post('/process-payment', paymentController.paymentProcess);
router.post('/', paymentController.postPayment);
router.post('/refund', paymentController.paymentRefund);

module.exports = router;