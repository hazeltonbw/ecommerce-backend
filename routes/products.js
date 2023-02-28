const express = require("express");
const router = express.Router();
const { isAdmin, isLoggedIn } = require("../middleware/auth");
const productController = require("../controllers/productController");

module.exports = (app) => {
  app.use("/products", isLoggedIn, router);
  router.get("/", productController.getProducts);
  router.get("/:id", productController.getProductById);
  router.put("/:id", isAdmin, productController.updateProductById);
  router.post("/", isAdmin, productController.addProduct);
  router.delete("/:id", isAdmin, productController.deleteProductById);
};
