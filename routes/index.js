// Holds all of the various express routers (users, products, orders)
const userRouter = require("./users");
const authRouter = require("./auth");
const productsRouter = require("./products");
const cartRouter = require("./cart");
module.exports = (app, passport) => {
  userRouter(app);
  authRouter(app, passport);
  productsRouter(app);
  cartRouter(app);
};
