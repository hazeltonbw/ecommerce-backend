"use strict";

var express = require("express");

var router = express.Router();

var cartController = require("../controllers/cartController");

var _require = require("../middleware/auth"),
    isLoggedIn = _require.isLoggedIn,
    isAdmin = _require.isAdmin;

var _require2 = require("../middleware/cart"),
    hasItemsInCart = _require2.hasItemsInCart,
    resetCart = _require2.resetCart;

module.exports = function (app) {
  app.use("/cart", isLoggedIn, router);
  router.get("/", cartController.getUsersCart);
  router.put("/", cartController.editProductInCart);
  router["delete"]("/", cartController.deleteProductInCart);
  router.post("/add", cartController.addProductToCart);
  router.get("/admin", isAdmin, cartController.getCarts);
  router.post("/checkout", hasItemsInCart, cartController.checkout);
};