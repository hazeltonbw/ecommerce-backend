"use strict";

var _require = require("../middleware/cart"),
    resetCart = _require.resetCart;

var cartModel = require("../models/cart");

var orderModel = require("../models/order");

var getUsersCart = function getUsersCart(req, res, next) {
  var user_id, cart;
  return regeneratorRuntime.async(function getUsersCart$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          user_id = req.user.user_id;
          _context.next = 4;
          return regeneratorRuntime.awrap(cartModel.getCartByUserId(user_id));

        case 4:
          cart = _context.sent;
          res.status(200).send(cart);
          _context.next = 11;
          break;

        case 8:
          _context.prev = 8;
          _context.t0 = _context["catch"](0);
          next(_context.t0);

        case 11:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 8]]);
};

var getCarts = function getCarts(req, res, next) {
  var response;
  return regeneratorRuntime.async(function getCarts$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap(cartModel.getCarts());

        case 3:
          response = _context2.sent;
          res.status(200).send(response);
          _context2.next = 10;
          break;

        case 7:
          _context2.prev = 7;
          _context2.t0 = _context2["catch"](0);
          next(_context2.t0);

        case 10:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

var addProductToCart = function addProductToCart(req, res, next) {
  var data, response;
  return regeneratorRuntime.async(function addProductToCart$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          data = req.body;
          _context3.prev = 1;
          _context3.next = 4;
          return regeneratorRuntime.awrap(cartModel.addProductToCart(data));

        case 4:
          response = _context3.sent;
          res.status(200).send(response);
          _context3.next = 11;
          break;

        case 8:
          _context3.prev = 8;
          _context3.t0 = _context3["catch"](1);
          next(_context3.t0);

        case 11:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[1, 8]]);
};

var editProductInCart = function editProductInCart(req, res, next) {
  var data, response;
  return regeneratorRuntime.async(function editProductInCart$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          data = req.body;
          _context4.prev = 1;
          _context4.next = 4;
          return regeneratorRuntime.awrap(cartModel.editProductInCart(data));

        case 4:
          response = _context4.sent;
          res.status(200).send(response);
          _context4.next = 11;
          break;

        case 8:
          _context4.prev = 8;
          _context4.t0 = _context4["catch"](1);
          next(_context4.t0);

        case 11:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[1, 8]]);
};

var deleteProductInCart = function deleteProductInCart(req, res, next) {
  var data, response;
  return regeneratorRuntime.async(function deleteProductInCart$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          data = req.body;
          _context5.prev = 1;
          _context5.next = 4;
          return regeneratorRuntime.awrap(cartModel.deleteProductInCart(data));

        case 4:
          response = _context5.sent;
          res.status(200).send(response);
          _context5.next = 11;
          break;

        case 8:
          _context5.prev = 8;
          _context5.t0 = _context5["catch"](1);
          next(_context5.t0);

        case 11:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[1, 8]]);
};

var checkout = function checkout(req, res, next) {
  var _req$user, user_id, cart_id, date, status, data, newOrder;

  return regeneratorRuntime.async(function checkout$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _req$user = req.user, user_id = _req$user.user_id, cart_id = _req$user.cart_id;
          date = new Date().toISOString();
          status = "PENDING"; // TODO: Update to COMPLETE when implementing Stripe API

          data = {
            user_id: user_id,
            cart_id: cart_id,
            date: date,
            status: status
          };
          _context6.prev = 4;
          _context6.next = 7;
          return regeneratorRuntime.awrap(orderModel.createOrder(data));

        case 7:
          newOrder = _context6.sent;
          _context6.next = 10;
          return regeneratorRuntime.awrap(cartModel.resetCart(cart_id));

        case 10:
          res.status(200).send(newOrder);
          _context6.next = 16;
          break;

        case 13:
          _context6.prev = 13;
          _context6.t0 = _context6["catch"](4);
          next(_context6.t0);

        case 16:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[4, 13]]);
};

module.exports = {
  getUsersCart: getUsersCart,
  getCarts: getCarts,
  addProductToCart: addProductToCart,
  editProductInCart: editProductInCart,
  deleteProductInCart: deleteProductInCart,
  checkout: checkout
};