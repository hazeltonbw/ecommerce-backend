const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user");
const userModel = require("../models/user");

module.exports = (app) => {
  // Initialize passport
  app.use(passport.initialize());
  app.use(passport.session());

  // Set method to serialize data to store in cookie
  passport.serializeUser((user, done) => {
    done(null, user);
  });

  // Set method to deserialize data stored in cookie and attach to req.user
  passport.deserializeUser(async ({ user_id }, done) => {
    try {
      const user = await userModel.getUserById(user_id);
      return done(null, user);
    } catch (err) {
      done(err);
    }
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
