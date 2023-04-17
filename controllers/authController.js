const userModel = require("../models/user");
const cartModel = require("../models/cart");
const { ExpressErrorHandler } = require("../helperFunctions");

const loginPage = async (req, res, next) => {
  res.send("Redirected to /auth/login! :)");
};

const registerNewUser = async (req, res, next) => {
  const data = req.body;

  try {
    if (!data.password || !data.email) {
      throw new ExpressErrorHandler(
        400,
        "Missing email or password information!"
      );
    }
    const userData = await userModel.registerNewUser(data);
    if (!userData)
      throw new new ExpressErrorHandler(500, "User couldn't be created")();

    const cart = await cartModel.createCart(userData.user_id);
    const user = { ...userData, cart };

    req.login(user, (err) => {
      console.log("Registration successful.. Logging in user...");
      if (err) {
        return next(err);
      }
      return res.redirect("/");
    });
    //res.status(200).send({ ...user, ...cart });
  } catch (err) {
    next(err);
  }
};

const logout = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.clearCookie("connect.sid");
    req.session.destroy();
    res.status(200).send("LOGGED OUT");
  });
};

module.exports = {
  loginPage,
  registerNewUser,
  logout,
};
