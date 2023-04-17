"use strict";

var userModel = require("../models/user");

var cartModel = require("../models/cart");

var getUsers = function getUsers(req, res, next) {
  var response;
  return regeneratorRuntime.async(function getUsers$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(userModel.getUsers());

        case 3:
          response = _context.sent;
          res.status(200).send(response);
          _context.next = 10;
          break;

        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](0);
          next(_context.t0);

        case 10:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

var getUserById = function getUserById(req, res, next) {
  var id, response;
  return regeneratorRuntime.async(function getUserById$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          id = parseInt(req.params.id);
          _context2.next = 4;
          return regeneratorRuntime.awrap(userModel.getUserById(id));

        case 4:
          response = _context2.sent;
          res.status(200).json(response);
          _context2.next = 11;
          break;

        case 8:
          _context2.prev = 8;
          _context2.t0 = _context2["catch"](0);
          next(_context2.t0);

        case 11:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 8]]);
};

var updateUserById = function updateUserById(req, res, next) {
  var id, password, user, response;
  return regeneratorRuntime.async(function updateUserById$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          id = parseInt(req.params.id);
          password = req.body.password;
          user = {
            id: id,
            password: password
          };
          _context3.prev = 3;
          _context3.next = 6;
          return regeneratorRuntime.awrap(userModel.updateUserPassword(user));

        case 6:
          response = _context3.sent;
          res.status(200).send(response);
          _context3.next = 13;
          break;

        case 10:
          _context3.prev = 10;
          _context3.t0 = _context3["catch"](3);
          next(_context3.t0);

        case 13:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[3, 10]]);
};

var deleteUserById = function deleteUserById(req, res, next) {
  var id, cart_id;
  return regeneratorRuntime.async(function deleteUserById$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          id = req.params.id; //user_id

          _context4.next = 4;
          return regeneratorRuntime.awrap(cartModel.getCartIdByUserId(id));

        case 4:
          cart_id = _context4.sent;
          _context4.next = 7;
          return regeneratorRuntime.awrap(cartModel.deleteUsersCart(cart_id));

        case 7:
          _context4.next = 9;
          return regeneratorRuntime.awrap(userModel.deleteUserById(id));

        case 9:
          res.status(200).send({
            message: "User with userId: ".concat(id, " deleted from database.")
          });
          _context4.next = 16;
          break;

        case 12:
          _context4.prev = 12;
          _context4.t0 = _context4["catch"](0);
          console.error(_context4.t0);
          next(_context4.t0);

        case 16:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 12]]);
};

module.exports = {
  getUsers: getUsers,
  getUserById: getUserById,
  updateUserById: updateUserById,
  deleteUserById: deleteUserById
};