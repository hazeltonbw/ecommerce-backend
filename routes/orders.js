const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const { isLoggedIn, isAdmin } = require("../middleware/auth");

module.exports = (app) => {
  app.use("/orders", isLoggedIn, router);
  router.get("/", orderController.getOrders);
  router.get("/:order_id", orderController.getOrderById);
  router.put("/:order_id", orderController.updateOrderStatus);
};
