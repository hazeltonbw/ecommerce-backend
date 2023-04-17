"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var passport = require("passport");

var LocalStrategy = require("passport-local").Strategy;

var User = require("../models/user");

var userModel = require("../models/user");

var cartModel = require("../models/cart");

module.exports = function (app) {
  // Initialize passport
  app.use(passport.initialize());
  app.use(passport.session()); // Set method to serialize data to store in cookie
  // Registers a function used to serialize user objects into the session.

  passport.serializeUser(function (user, done) {
    console.log(user);
    done(null, user.user_id);
  }); // Set method to deserialize data stored in cookie and attach to req.user
  // Registers a function used to deserialize user objects out of the session.

  passport.deserializeUser(function _callee(_ref, done) {
    var user_id, user, cart_id;
    return regeneratorRuntime.async(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            user_id = _ref.user_id;
            _context.prev = 1;
            _context.next = 4;
            return regeneratorRuntime.awrap(userModel.getUserById(user_id));

          case 4:
            user = _context.sent;
            _context.next = 7;
            return regeneratorRuntime.awrap(cartModel.getCartIdByUserId(user_id));

          case 7:
            cart_id = _context.sent;
            console.log(user, "DESERIALIZE USER");
            return _context.abrupt("return", done(null, _objectSpread({}, user, {
              cart_id: cart_id
            })));

          case 12:
            _context.prev = 12;
            _context.t0 = _context["catch"](1);
            done(_context.t0);

          case 15:
          case "end":
            return _context.stop();
        }
      }
    }, null, null, [[1, 12]]);
  }); // Configure local strategy to be used for local login

  passport.use(new LocalStrategy({
    usernameField: "email",
    passwordField: "password"
  }, //opts
  function _callee2(email, password, done) {
    var user;
    return regeneratorRuntime.async(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _context2.next = 3;
            return regeneratorRuntime.awrap(User.loginUser({
              email: email,
              password: password
            }));

          case 3:
            user = _context2.sent;
            console.log(user, "LocalStrategy");
            return _context2.abrupt("return", done(null, user));

          case 8:
            _context2.prev = 8;
            _context2.t0 = _context2["catch"](0);
            return _context2.abrupt("return", done(_context2.t0));

          case 11:
          case "end":
            return _context2.stop();
        }
      }
    }, null, null, [[0, 8]]);
  }));
  return passport;
};