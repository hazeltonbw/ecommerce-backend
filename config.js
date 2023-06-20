const { enviornmentVariablesChecker } = require("./helperFunctions");

/*
@hazeltonbw When running `npm run create-db` there are no enviornment variables.
By using the npm package `dotenv` we can use the .env file at root. You may not want to do it this way,
but either way the npm script doesn't seem to be picking up the .env in root.
*/
const dotenv = require("dotenv").config({ path: "./.env" });
enviornmentVariablesChecker(dotenv);
module.exports = {
  PORT: process.env.PORT,
  DB: {
    PGHOST: process.env.PGHOST,
    PGUSER: process.env.PGUSER,
    LIVE_DATABASE_URL: process.env.LIVE_DATABASE_URL,
    ORIGIN_URL: process.env.NODE_ENV === "production" ? process.env.LIVE_ORIGIN_URL : process.env.LOCAL_ORIGIN_URL,
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
    USER_SESSIONS_TABLE: "user_sessions",
  },
  SESSION: {
    COOKIE: {
      secure: false,
      // Week long cookie age
      // 24 hours * 60 mins * 60 secs * 1000ms
      maxAge: 24 * 60 * 60 * 1000,
      domain: process.env.LIVE_ORIGIN_URL,
      // maxAge: 10 * 1000, // max age = 10 secs
    },
    SESSION_SECRET: process.env.SESSION_SECRET,
  },
};
