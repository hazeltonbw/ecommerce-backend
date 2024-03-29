const cartModel = require("../models/cart");
const orderModel = require("../models/order");

const getUsersCart = async (req, res, next) => {
  try {
    const { user_id } = req.user;
    const cart = await cartModel.getCartByUserId(user_id);
    res.status(200).json(cart);
  } catch (err) {
    next(err);
  }
};

const getCarts = async (req, res, next) => {
  try {
    const response = await cartModel.getCarts();
    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
};

const addProductToCart = async (req, res, next) => {
  const { product_id, qty } = req.body;
  const { cart_id } = req.user;
  const data = { product_id, qty, cart_id };
  try {
    const response = await cartModel.addProductToCart(data);
    res.status(200).send(response);
  } catch (err) {
    next(err);
  }
};

const editProductInCart = async (req, res, next) => {
  const { product_id, qty } = req.body;
  const { cart_id } = req.user;
  const data = { cart_id, product_id, qty };
  try {
    const response = await cartModel.editProductInCart(data);
    res.status(200).send(response);
  } catch (err) {
    next(err);
  }
};

const deleteProductInCart = async (req, res, next) => {
  const { product_id } = req.body;
  const { cart_id } = req.user;
  const data = { cart_id, product_id };

  try {
    const response = await cartModel.deleteProductInCart(data);
    res.status(200).send(response);
  } catch (err) {
    next(err);
  }
};

const checkout = async (req, res, next) => {
  const { user_id, cart_id } = req.user;
  const date = new Date().toISOString();
  const status = "PENDING"; // TODO: Update to COMPLETE when implementing Stripe API
  const data = { user_id, cart_id, date, status };
  try {
    // create new order
    // parameters: user_id, cart_id, date, status = data;
    const newOrder = await orderModel.createOrder(data);
    // reset cart back to empty
    await cartModel.resetCart(cart_id);
    res.status(200).send(newOrder);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getUsersCart,
  getCarts,
  addProductToCart,
  editProductInCart,
  deleteProductInCart,
  checkout,
};
