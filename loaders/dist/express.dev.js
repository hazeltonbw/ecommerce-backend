"use strict";

var bodyParser = require("body-parser");

var cors = require("cors");

var session = require("express-session");

var pgSession = require("connect-pg-simple")(session);

var pgPool = require("../db/index");

var config = require("../config");

module.exports = function (app) {
  // Enable Cross Origin Resource Sharing to all origins by default
  app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
  })); // Logging
  //app.use(morgan("dev"));   // Normal dev logging
  //app.use(morgan(':method :url :status :response-time :date')); // Custom logger to include date
  // Disable logger when testing with Jest
  // This is done to prevent errors in Jest.
  // Also disable logger when build is production

  if (process.env.NODE_ENV !== "test" || process.env.NODE_ENV !== "production") {
    var logger = require("morgan");

    app.use(logger(":method :url :status :response-time :date", {
      skip: function skip(req, res) {
        return process.env.NODE_ENV === "test";
      }
    }));
  } // Transforms raw string of req.body into JSON


  app.use(bodyParser.json()); // Parses urlencoded bodies

  app.use(bodyParser.urlencoded({
    extended: true
  })); //
  //app.set("trust proxy", 1);
  // Creates a session

  app.use(session({
    store: new pgSession({
      pool: pgPool,
      tableName: config.DB.USER_SESSIONS_TABLE
    }),
    secret: config.SESSION.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: config.SESSION.COOKIE
  }));
  return app;
};