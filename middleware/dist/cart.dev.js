"use strict";

var cartModel = require("../models/cart");

var hasItemsInCart = function hasItemsInCart(req, res, next) {
  var user_id, cart;
  return regeneratorRuntime.async(function hasItemsInCart$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          user_id = req.user.user_id;
          _context.prev = 1;
          _context.next = 4;
          return regeneratorRuntime.awrap(cartModel.getCartByUserId(user_id));

        case 4:
          cart = _context.sent;

          if (cart) {
            _context.next = 7;
            break;
          }

          return _context.abrupt("return", res.status(400).send({
            message: "No items in your cart!"
          }));

        case 7:
          next();
          _context.next = 13;
          break;

        case 10:
          _context.prev = 10;
          _context.t0 = _context["catch"](1);
          next(_context.t0);

        case 13:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[1, 10]]);
};

module.exports = {
  hasItemsInCart: hasItemsInCart
};