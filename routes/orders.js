const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const { isLoggedIn } = require("../middleware/auth");
const bodyParser = require("body-parser");

module.exports = (app) => {

    app.use("/orders", router);
    router.get("/", isLoggedIn, orderController.getOrders);
    router.get("/recent", isLoggedIn, orderController.getLatestOrder)
    /**
     * Returns middleware that parses all bodies as a string and only looks at requests
     * where the Content-Type header matches the type option.
     * https://github.com/expressjs/body-parser/tree/1.19.0#bodyparserrawoptions
     */
    router.post("/webhook", express.raw({ type: 'application/json' }),
        // https://stripe.com/docs/webhooks/quickstart
        // Use Stripe webhooks for post-payment database processing
        orderController.handleStripeEvent, orderController.createOrder)
    router.post("/new", isLoggedIn, orderController.createOrder);
    router.get("/:order_id", isLoggedIn, orderController.getOrderById);
    router.put("/:order_id", isLoggedIn, orderController.updateOrderStatus);
};
