const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user");
const userModel = require("../models/user");
const cartModel = require("../models/cart");
require("colors");

module.exports = (app) => {
  // Initialize passport
  app.use(passport.initialize());
  app.use(passport.session());

  // Set method to serialize data to store in cookie
  // Registers a function used to serialize user objects into the session.
  passport.serializeUser((user, done) => {
    console.log("Attempting to serialize user".red);
    console.log(user);
    done(null, user.user_id);
  });

  // Set method to deserialize data stored in cookie and attach to req.user
  // Registers a function used to deserialize user objects out of the session.
  passport.deserializeUser(async (user_id, done) => {
    try {
      console.log("Attempting to deserialize user_id".red);
      let user = await userModel.getUserById(user_id);
      const cart_id = await cartModel.getCartIdByUserId(user_id);
      console.log(user, "DESERIALIZE USER");
      user = { ...user, cart_id };
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

  // Configure local strategy to be used for local login
  passport.use(
    new LocalStrategy(
      { usernameField: "email", passwordField: "password" }, //opts
      async (email, password, done) => {
        debugger;
        try {
          // Check for user in PostgreSQL database
          const user = await User.loginUser({ email, password });
          console.log(user, "LocalStrategy");
          done(null, user);
        } catch (err) {
          done(err);
        }
      }
    )
  );
  return passport;
};
