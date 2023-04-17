"use strict";

var express = require("express");

var router = express.Router();

var orderController = require("../controllers/orderController");

var _require = require("../middleware/auth"),
    isLoggedIn = _require.isLoggedIn,
    isAdmin = _require.isAdmin;

module.exports = function (app) {
  app.use("/orders", isLoggedIn, router);
  router.get("/", orderController.getOrders);
  router.get("/:order_id", orderController.getOrderById);
  router.put("/:order_id", orderController.updateOrderStatus);
};