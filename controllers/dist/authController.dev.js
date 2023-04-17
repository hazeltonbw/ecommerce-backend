"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var userModel = require("../models/user");

var cartModel = require("../models/cart");

var loginPage = function loginPage(req, res, next) {
  return regeneratorRuntime.async(function loginPage$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          res.send("Redirected to /auth/login! :)");

        case 1:
        case "end":
          return _context.stop();
      }
    }
  });
};

var registerNewUser = function registerNewUser(req, res, next) {
  var data, userData, cart, user;
  return regeneratorRuntime.async(function registerNewUser$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          data = req.body;

          if (!data.password || !data.email) {
            res.status(400).send({
              message: "Missing email or password information!"
            });
          }

          _context2.prev = 2;
          _context2.next = 5;
          return regeneratorRuntime.awrap(userModel.registerNewUser(data));

        case 5:
          userData = _context2.sent;

          if (userData) {
            _context2.next = 8;
            break;
          }

          throw new Error("User couldn't be created");

        case 8:
          _context2.next = 10;
          return regeneratorRuntime.awrap(cartModel.createCart(userData.user_id));

        case 10:
          cart = _context2.sent;
          user = _objectSpread({}, userData, {
            cart: cart
          });
          req.login(user, function (err) {
            console.log("Registration successful.. Logging in user...");

            if (err) {
              return next(err);
            }

            res.redirect("/");
          }); //res.status(200).send({ ...user, ...cart });

          _context2.next = 18;
          break;

        case 15:
          _context2.prev = 15;
          _context2.t0 = _context2["catch"](2);
          next(_context2.t0);

        case 18:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[2, 15]]);
};

var logout = function logout(req, res, next) {
  req.logout(function (err) {
    if (err) return next(err);
    res.clearCookie("connect.sid");
    req.session.destroy();
    res.status(200).send("LOGGED OUT");
  });
};

module.exports = {
  loginPage: loginPage,
  registerNewUser: registerNewUser,
  logout: logout
};