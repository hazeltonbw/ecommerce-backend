const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const User = require("../models/user");

module.exports = (app) => {
  // Initialize passport
  app.use(passport.initialize());
  app.use(passport.session());

  // Set method to serialize data to store in cookie
  passport.serializeUser((user, done) => {
    done(null, user.user_id);
  });

  // Set method to deserialize data stored in cookie and attach to req.user
  passport.deserializeUser((user_id, done) => {
    done(null, { user_id });
  });

  // Configure local strategy to be use for local login
  passport.use(
    new LocalStrategy(
      { usernameField: "email", passwordField: "password" }, //opts
      async (email, password, done) => {
        try {
          // Check for user in PostgreSQL database
          const user = await User.loginUser({ email, password });
          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  return passport;
};
