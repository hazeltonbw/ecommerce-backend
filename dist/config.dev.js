"use strict";

/*
@hazeltonbw When running `npm run create-db` there are no enviornment variables.
By using the npm package `dotenv` we can use the .env file at root. You may not want to do it this way,
but either way the npm script doesn't seem to be picking up the .env in root.
*/
var dotenv = require("dotenv").config();

console.debug(dotenv);
module.exports = {
  PORT: process.env.PORT,
  DB: {
    PGHOST: process.env.PGHOST,
    PGUSER: process.env.PGUSER,
    PGDATABASE: process.env.PGDATABASE,
    PGPASSWORD: process.env.PGPASSWORD,
    PGPORT: process.env.PGPORT,
    USERS_TABLE: "users",
    CATEGORIES_TABLE: "categories",
    PRODUCTS_TABLE: "products",
    ORDERS_TABLE: "orders",
    CARTS_TABLE: "carts",
    CART_HAS_PRODUCTS_TABLE: "cart_has_products",
    ORDER_HAS_PRODUCTS_TABLE: "order_has_products",
    USER_SESSIONS_TABLE: "user_sessions"
  },
  SESSION: {
    COOKIE: {
      secure: false,
      maxAge: 24 * 60 * 60 * 1000
    },
    SESSION_SECRET: process.env.SESSION_SECRET
  }
};