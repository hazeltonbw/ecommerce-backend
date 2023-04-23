const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { isLoggedIn, isAlreadyLoggedIn} = require("../middleware/auth");
const { ExpressErrorHandler } = require("../helperFunctions");

module.exports = (app, passport) => {
  app.use("/auth", router);
  router.post("/register", authController.registerNewUser);
  router.get("/login", isAlreadyLoggedIn);
  router.post(
    "/login",
    passport.authenticate("local"),
    async (req, res, next) => {
      const user = req.user;
      req.session.user = user;
      if (!user) {
        // we didnt get a user back from passport authenticate
        res.status(401).send({ message: "Incorrect username or password" });
      }
      res.status(200).send(user);
    }
  );
  router.post("/logout", authController.logout);
};
