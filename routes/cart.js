const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const { isLoggedIn, isAdmin } = require("../middleware/auth");
const { hasItemsInCart, resetCart } = require("../middleware/cart");

module.exports = (app) => {
  app.use("/cart", isLoggedIn, router);
  router.get("/", cartController.getUsersCart);
  router.put("/", cartController.editProductInCart);
  router.delete("/", cartController.deleteProductInCart);
  router.post("/add", cartController.addProductToCart);
  router.get("/admin", isAdmin, cartController.getCarts);
  router.post("/checkout", hasItemsInCart, cartController.checkout);
};
