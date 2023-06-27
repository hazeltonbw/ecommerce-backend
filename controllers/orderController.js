require("dotenv").config({
  path: "../.env",
});
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.NODE_ENV === "production" ? process.env.STRIPE_WEBHOOK_SECRET_LIVE : process.env.STRIPE_WEBHOOK_SECRET_LOCAL;
const { getCartIdByUserId } = require("../models/cart");
const orderModel = require("../models/order");

const handleStripeEvent = async (req, res, next) => {
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret);
  } catch (err) {
    // On error, log and return the error message
    console.log(`❌ Error message: ${err.message}`);
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  const paymentIntent = event.data.object;
  switch (event.type) {
    case "payment_intent.succeeded":
      console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`);
      req.user = { ...req.user, ...paymentIntent.metadata };
      return next();
    // case 'payment_method.attached':
    case "charge.succeeded":
      console.log("Charge succeeded!");
      break;
    default:
      // Unexpected event type
      console.log(`Unhandled event type ${event.type}.`);
  }

  // Return a 200 response to acknowledge receipt of the event
  res.send();
};

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
  const { user_id } = req.user;
  const data = { user_id, order_id };
  try {
    const response = await orderModel.getOrderById(data);
    console.log(response);
    if (response == null) res.sendStatus(204);
    else res.status(200).send(response);
  } catch (err) {
    next(err);
  }
};

const getLatestOrder = async (req, res, next) => {
  const { user_id } = req.user;
  try {
    const response = await orderModel.getLatestOrder(user_id);
    res.status(200).send(response);
  } catch (err) {
    console.error(err);
    next(err);
  }
};

const createOrder = async (req, res, next) => {
  const { user_id } = req.user;
  const date = new Date(Date.now()).toISOString();
  const cart_id = await getCartIdByUserId(user_id);
  const status = "COMPLETE";
  const data = { user_id, status, date, cart_id };
  try {
    const response = await orderModel.createOrder(data);
    // req.user.new_order_id = response.order_id;
    res.status(200).send(response);
  } catch (err) {
    console.error(err);
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
  getLatestOrder,
  createOrder,
  updateOrderStatus,
  handleStripeEvent,
};
