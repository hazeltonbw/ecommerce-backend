const orderModel = require("../models/order");

const getOrders = async (req, res, next) => {
  const { user_id } = req.user;
  try {
    const response = await orderModel.getOrders(user_id);
    res.status(200).send(response);
  } catch (err) {
    next(err);
  }
};

const getOrderById = async (req, res, next) => {
  const { order_id } = req.params;
  try {
    const response = await orderModel.getOrderById(order_id);
    res.status(200).send(response);
  } catch (err) {
    next(err);
  }
};

const createOrder = async (req, res, next) => {
  const data = req.body;
  try {
    const response = await orderModel.createOrder(data);
    res.status(200).send(response);
  } catch (err) {
    next(err);
  }
};

const updateOrderStatus = async (req, res, next) => {
  const { order_id } = req.params;
  const { status } = req.body;
  try {
    const response = await orderModel.updateOrderStatus(order_id, status);
    res.status(200).send(response);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
};
