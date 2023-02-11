const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

module.exports = (app, passport) => {
  app.use("/auth", router);
  router.get("/login", authController.loginPage);
  router.post("/register", authController.registerNewUser);
  router.post(
    "/login/password",
    passport.authenticate("local", {
      failureRedirect: "/auth/login",
    }),
    async (req, res, next) => {
      const user = req.user;
      if (!user) {
        // we didnt get a user back from passport authenticate
        res.status(401).send({ message: "Incorrect username or password" });
      }
      res.status(200).send(user);
    }
  );
  router.post("/logout", authController.logout);
};
