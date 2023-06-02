const express = require("express");
const router = express.Router();
const { isAdmin, isLoggedIn } = require("../middleware/auth");
const userController = require("../controllers/userController");

module.exports = (app) => {
  app.use("/users", router);
  router.get("/", isAdmin, userController.getUsers);
  router.delete("/:id", isAdmin, userController.deleteUserById);
  router.get("/:id", isLoggedIn, userController.getUserById);
  router.put("/:id", isLoggedIn, userController.updateUserById);
};
