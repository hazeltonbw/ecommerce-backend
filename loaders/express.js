const bodyParser = require("body-parser");
const cors = require("cors");
const session = require("express-session");
const pgSession = require("connect-pg-simple")(session);
const pgPool = require("../db/index");

const { SESSION_SECRET } = require("../config");

module.exports = (app) => {
  // Enable Cross Origin Resource Sharing to all origins by default
  app.use(cors());

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

  //
  app.set("trust proxy", 1);

  // Creates a session
  app.use(
    session({
      store: new pgSession({
        pool: pgPool,
        tableName: "user_sessions",
        createTableIfMissing: true,
      }),
      secret: SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: false,
        maxAge: 24 * 60 * 60 * 1000,
      },
    })
  );

  return app;
};
