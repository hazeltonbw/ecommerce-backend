const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");

module.exports = (app) => {
  app.use("/cart", router);
  router.get("/", cartController.getUsersCart);
};
