const userModel = require("../models/user");
const cartModel = require("../models/cart");

const loginPage = async (req, res, next) => {
  res.send("Redirected to /auth/login! :)");
};

const registerNewUser = async (req, res, next) => {
  const data = req.body;
  if (!data.password || !data.email) {
    res.status(400).send({ message: `Missing email or password information!` });
  }
  try {
    const user = await userModel.registerNewUser(data);
    if (!user) throw new Error("User couldn't be created");

    const cart = await cartModel.createCart(user.user_id);
    res.status(200).send({ ...user, ...cart });
  } catch (err) {
    next(err);
  }
};

const logout = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.clearCookie("connect.sid");
    req.session.destroy();
    res.redirect("/auth/login");
  });
};

module.exports = {
  loginPage,
  registerNewUser,
  logout,
};
