require("dotenv").config({
  path: "../.env",
});

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const createPaymentIntent = async (req, res, next) => {
  console.log("Creating payment intent...".red);
  const { user_id } = req.user;
  try {
    // don't return any decimal points, as we are using cents here
    // Stripe api requires cents for amount value
    const total = (req.body.total * 100).toFixed(0);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: total,
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        user_id: user_id,
      }
    });
    res.status(200).send({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createPaymentIntent
}
