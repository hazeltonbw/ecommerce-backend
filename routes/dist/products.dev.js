"use strict";

var express = require("express");

var router = express.Router();

var _require = require("../middleware/auth"),
    isAdmin = _require.isAdmin,
    isLoggedIn = _require.isLoggedIn;

var productController = require("../controllers/productController");

module.exports = function (app) {
  app.use("/products", router);
  router.get("/", productController.getProducts);
  router.post("/", productController.addProduct);
  router.get("/:id", productController.getProductById);
  router.put("/:id", productController.updateProductById);
  router["delete"]("/:id", productController.deleteProductById);
};