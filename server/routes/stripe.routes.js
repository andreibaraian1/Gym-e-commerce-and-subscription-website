const express = require("express");
const router = express.Router();
const stripeController = require("../controllers/stripe.controller");
const bodyParser = require("body-parser");

router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  stripeController.webhook
);

module.exports = router;
