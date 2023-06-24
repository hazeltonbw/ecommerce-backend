const bodyParser = require("body-parser");
const cors = require("cors");
const session = require("express-session");
const pgSession = require("connect-pg-simple")(session);
const pgPool = require("../db/index");
const config = require("../config");
const express = require("express");

module.exports = (app) => {
    // origin: "http://localhost:5173",
    // origin: config.DB.ORIGIN_URL,
    //            origin: [config.DB.ORIGIN_URL, "ecommerce-ttgf.onrender.com", "http://localhost:5173"],
    app.use(
        cors({
            origin: process.env.NODE_ENV === "production" ? /onrender\.com$/ : "http://localhost:5173",
            credentials: true,
        })
    );

    // Logging
    //app.use(morgan("dev"));   // Normal dev logging
    //app.use(morgan(':method :url :status :response-time :date')); // Custom logger to include date

    // Disable logger when testing with Jest
    // This is done to prevent errors in Jest.
    // Also disable logger when build is production
    if (
        process.env.NODE_ENV !== "test" ||
        process.env.NODE_ENV !== "production"
    ) {
        const logger = require("morgan");
        app.use(
            logger(":method :url :status :response-time :date", {
                skip: () => process.env.NODE_ENV === "test",
            })
        );
    }

    //app.use((req, res, next) => {
    // If the request is for the webhook, the body
    // must be a string and not parsed as JSON. 
    // https://github.com/stripe/stripe-node/blob/master/examples/webhook-signing/express/main.ts
    //if (req.originalUrl === '/orders/webhook') {
    //next();
    //} else {
    // Transforms raw string of req.body into JSON
    //bodyParser.json()(req, res, next);
    //}
    //}
    //);
    app.use(express.json({
        limit: '5mb',
        verify: (req, res, buf) => {
            req.rawBody = buf.toString();
        },
    }));

    // Parses urlencoded bodies
    app.use(express.urlencoded({ extended: true }));

    // Creates a session
    app.use(
        session({
            store: new pgSession({
                pool: pgPool,
                tableName: config.DB.USER_SESSIONS_TABLE,
            }),
            secret: config.SESSION.SESSION_SECRET,
            resave: false,
            cookie: {
                secure: 'auto',
                // Week long cookie age
                // 24 hours * 60 mins * 60 secs * 1000ms
                maxAge: 7 * 24 * 60 * 60 * 1000,
                sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
                //sameSite: "strict"
            },
            saveUninitialized: false,
        })
    );

    return app;
};
