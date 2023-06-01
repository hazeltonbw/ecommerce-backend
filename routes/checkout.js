const express = require("express");
const router = express.Router();
const checkoutController = require("../controllers/checkoutController");
const { isLoggedIn } = require("../middleware/auth")
module.exports = (app) => {
  app.use("/checkout", router);
  router.post("/create-payment-intent", checkoutController.createPaymentIntent);
};
