"use strict";

// Holds all of the various express routers (users, products, orders)
var userRouter = require("./users");

var authRouter = require("./auth");

var productsRouter = require("./products");

var cartRouter = require("./cart");

var orderRouter = require("./orders");

module.exports = function (app, passport) {
  userRouter(app);
  authRouter(app, passport);
  productsRouter(app);
  cartRouter(app);
  orderRouter(app);
};