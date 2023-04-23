"use strict";

var express = require("express");

var router = express.Router();

var _require = require("../middleware/auth"),
    isAdmin = _require.isAdmin,
    isLoggedIn = _require.isLoggedIn;

var userController = require("../controllers/userController");

module.exports = function (app) {
  app.use("/users", router);
  router.get("/", userController.getUsers);
  router["delete"]("/:id", userController.deleteUserById);
  router.get("/:id", userController.getUserById);
  router.put("/:id", userController.updateUserById);
};