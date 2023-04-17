"use strict";

var express = require("express");

var router = express.Router();

var authController = require("../controllers/authController");

var _require = require("../middleware/auth"),
    isLoggedIn = _require.isLoggedIn;

module.exports = function (app, passport) {
  app.use("/auth", router);
  router.get("/login", authController.loginPage);
  router.post("/register", authController.registerNewUser);
  router.post("/login", passport.authenticate("local"), function _callee(req, res, next) {
    var user;
    return regeneratorRuntime.async(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            console.log("making it here?");
            user = req.user;
            console.log(user, "req.user TESTTTTTTTTT");

            if (!user) {
              // we didnt get a user back from passport authenticate
              res.status(401).send({
                message: "Incorrect username or password"
              });
            }

            res.status(200).send(user);

          case 5:
          case "end":
            return _context.stop();
        }
      }
    });
  });
  router.post("/logout", authController.logout);
};