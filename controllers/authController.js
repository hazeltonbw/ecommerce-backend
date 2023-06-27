const userModel = require("../models/user");
const cartModel = require("../models/cart");
const { ExpressErrorHandler } = require("../helperFunctions");

const registerNewUser = async (req, res, next) => {
  const data = req.body;

  try {
    if (!data.password || !data.email) {
      throw new ExpressErrorHandler(400, "Missing email or password information!")
    }
    const userData = await userModel.registerNewUser(data);
    if (!userData) {
      throw new ExpressErrorHandler(500, "User couldn't be created.")
    }

    // Create the users cart
    await cartModel.createCart(userData.user_id);
    const user = { ...userData };

    res.status(200).send(user);
  } catch (err) {
    next(err);
  }
};

const logout = (req, res, next) => {
  req.logout((err) => {
    if (err) next(err);
    if (req.session) {
      req.session.destroy();
    }
    res.status(200).json("Logged out");
  });
};

module.exports = {
  registerNewUser,
  logout,
};
