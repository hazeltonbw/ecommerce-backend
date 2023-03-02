const cartModel = require("../models/cart");

const hasItemsInCart = async (req, res, next) => {
  const { user_id } = req.user;
  try {
    const cart = await cartModel.getCartByUserId(user_id);
    if (!cart) {
      console.log("nothing in ur cart bro");
      return res.status(400).send({ message: "No items in your cart!" });
    }
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = {
  hasItemsInCart,
};
