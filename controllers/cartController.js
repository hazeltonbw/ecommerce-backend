const cartModel = require("../models/cart");

const getUsersCart = async (req, res, next) => {
  try {
    const { user_id } = req.user;
    const cart = await cartModel.getCartByUserId(user_id);
    res.status(200).send(cart);
  } catch (err) {
    next(err);
  }
};

const getCarts = async (req, res, next) => {
  try {
    const response = await cartModel.getCarts();
    res.status(200).send(response);
  } catch (err) {
    next(err);
  }
};

const addProductToCart = async (req, res, next) => {
  const data = req.body;
  try {
    const response = await cartModel.addProductToCart(data);
    res.status(200).send(response);
  } catch (err) {
    next(err);
  }
};

const editProductInCart = async (req, res, next) => {
  const data = req.body;
  try {
    const response = await cartModel.editProductInCart(data);
    res.status(200).send(response);
  } catch (err) {
    next(err);
  }
};

const deleteProductInCart = async (req, res, next) => {
  const data = req.body;
  try {
    const response = await cartModel.deleteProductInCart(data);
    res.status(200).send(response);
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
};
