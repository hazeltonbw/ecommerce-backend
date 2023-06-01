const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { isAlreadyLoggedIn } = require("../middleware/auth");

module.exports = (app, passport) => {
  app.use("/auth", router);
  router.post("/register", authController.registerNewUser);
  router.get("/login", isAlreadyLoggedIn);
  router.post(
    "/login",
    passport.authenticate("local"),
    async (req, res) => {
      const user = req.user;
      if (!user) {
        // we didnt get a user back from passport authenticate
        res.status(401).send("Incorrect username or password");
      }
      req.session.user = user;
      res.status(200).send(user);
    }
  );
  router.post("/logout", authController.logout);
};
