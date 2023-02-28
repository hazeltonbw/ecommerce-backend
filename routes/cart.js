const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const { isLoggedIn, isAdmin } = require("../middleware/auth");

module.exports = (app) => {
  app.use("/cart", router);
  router.get("/", isLoggedIn, cartController.getUsersCart);
  router.put("/", isLoggedIn, cartController.editProductInCart);
  router.delete("/", isLoggedIn, cartController.deleteProductInCart);
  router.post("/add", isLoggedIn, cartController.addProductToCart);
  router.get("/admin", isLoggedIn, isAdmin, cartController.getCarts);
};
