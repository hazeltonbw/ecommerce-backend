const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { isLoggedIn } = require("../middleware/auth");

module.exports = (app, passport) => {
  app.use("/auth", router);
  router.post("/register", authController.registerNewUser);
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
