const bodyParser = require("body-parser");
const cors = require("cors");
const session = require("express-session");
const pgSession = require("connect-pg-simple")(session);
const pgPool = require("../db/index");
const config = require("../config");

function dynamicOriginConfig(origin, callback) {
  if (
    process.env.NODE_ENV === "development" ||
    process.env.NODE_ENV === "test"
  ) {
    callback(null, true);
    return;
  }
  if (process.env.WHITE_LIST.indexOf(origin) !== -1) {
    callback(null, true);
  } else {
    callback(new Error("Not allowed by CORS"));
  }
}

module.exports = (app) => {
  app.use(
    cors({
      origin: "http://localhost:5173", //TODO: Figure out how to incorporate dynamicOriginConfig() here
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
        skip: (req, res) => process.env.NODE_ENV === "test",
      })
    );
  }

  // Transforms raw string of req.body into JSON
  app.use(bodyParser.json());

  // Parses urlencoded bodies
  app.use(bodyParser.urlencoded({ extended: true }));

  //app.set("trust proxy", 1);

  // Creates a session
  app.use(
    session({
      store: new pgSession({
        pool: pgPool,
        tableName: config.DB.USER_SESSIONS_TABLE,
      }),
      secret: config.SESSION.SESSION_SECRET,
      resave: false,
      cookie: config.SESSION.COOKIE,
      saveUninitialized: false,
    })
  );

  return app;
};
