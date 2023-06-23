require("dotenv").config({
    path: "../.env",
});
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
const { getCartIdByUserId } = require("../models/cart");
const orderModel = require("../models/order");

const handleStripeEvent = async (req, res, next) => {
    const sig = req.headers['stripe-signature'];

    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
        // On error, log and return the error message
        console.log(`❌ Error message: ${err.message}`);
        res.status(400).send(`Webhook Error: ${err.message}`);
        return;
    }

    // Only verify the event if you have an endpoint secret defined.
    // Otherwise use the basic event deserialized with JSON.parse

    //if (endpointSecret) {
    // Get the signature sent by Stripe
    //   const signature = req.headers["stripe-signature"];
    //  try {
    //     event = stripe.webhooks.constructEvent(
    //        req.body,
    //       signature,
    //      endpointSecret
    // );
    //} catch (err) {
    //   console.log(`⚠️  Webhook signature verification failed.`, err.message);
    //  console.log(err);
    // return res.sendStatus(400);
    //}
    //}

    // Handle the event
    const paymentIntent = event.data.object;
    switch (event.type) {
        case "payment_intent.succeeded":
            console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`);
            req.user = { ...req.user, ...paymentIntent.metadata };
            return next();
        // Then define and call a method to handle the successful payment intent.
        // handlePaymentIntentSucceeded(paymentIntent);
        // break;
        // case 'payment_method.attached':
        //   // const paymentMethod = event.data.object;
        //   // Then define and call a method to handle the successful attachment of a PaymentMethod.
        //   // handlePaymentMethodAttached(paymentMethod);
        //   break;
        case "charge.succeeded":
            // req.user = { ...req.user, ...paymentIntent.metadata }
            console.log("Charge succeeded!");
            break;
        // return next();
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

// const completeOrder = async (req, res, next) => {
//   console.log("Successful payment... completing users order")
//   const { user_id, order_id } = req.user;
//   const cart_id = await getCartIdByUserId(user_id);
//   const date = new Date(Date.now()).toISOString();
//   const status = "COMPLETED";
//   const data = { user_id, order_id, cart_id, date, status }
//   try {
//     const response = await orderModel.completeOrder(data);
//     res.status(200).send(response);
//   } catch (err) {
//     next(err);
//   }
// }

// const updateOrder = async (req, res, next) => {

//   const { user_id, order_id } = req.user;
//   console.log(order_id, "NEW ORDER IDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD")
//   const cart_id = await getCartIdByUserId(user_id);
//   console.log(`Creating order in DB for user: ${user_id}`.red)
//   const date = new Date(Date.now()).toISOString();
//   const status = "COMPLETED";
//   const data = { user_id, cart_id, date, status }
//   try {
//     const response = await orderModel.createOrder(data);
//     res.status(200).send(response);
//   } catch (err) {
//     next(err);
//   }
// };

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
    // completeOrder,
    getLatestOrder,
    createOrder,
    updateOrderStatus,
    handleStripeEvent,
};
