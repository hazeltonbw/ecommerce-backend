"use strict";

var orderModel = require("../models/order");

var getOrders = function getOrders(req, res, next) {
  var user_id, response;
  return regeneratorRuntime.async(function getOrders$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          user_id = req.user.user_id;
          _context.prev = 1;
          _context.next = 4;
          return regeneratorRuntime.awrap(orderModel.getOrders(user_id));

        case 4:
          response = _context.sent;
          res.status(200).send(response);
          _context.next = 11;
          break;

        case 8:
          _context.prev = 8;
          _context.t0 = _context["catch"](1);
          next(_context.t0);

        case 11:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[1, 8]]);
};

var getOrderById = function getOrderById(req, res, next) {
  var order_id, response;
  return regeneratorRuntime.async(function getOrderById$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          order_id = req.params.order_id;
          _context2.prev = 1;
          _context2.next = 4;
          return regeneratorRuntime.awrap(orderModel.getOrderById(order_id));

        case 4:
          response = _context2.sent;
          res.status(200).send(response);
          _context2.next = 11;
          break;

        case 8:
          _context2.prev = 8;
          _context2.t0 = _context2["catch"](1);
          next(_context2.t0);

        case 11:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[1, 8]]);
};

var createOrder = function createOrder(req, res, next) {
  var data, response;
  return regeneratorRuntime.async(function createOrder$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          data = req.body;
          _context3.prev = 1;
          _context3.next = 4;
          return regeneratorRuntime.awrap(orderModel.createOrder(data));

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

var updateOrderStatus = function updateOrderStatus(req, res, next) {
  var order_id, status, response;
  return regeneratorRuntime.async(function updateOrderStatus$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          order_id = req.params.order_id;
          status = req.body.status;
          _context4.prev = 2;
          _context4.next = 5;
          return regeneratorRuntime.awrap(orderModel.updateOrderStatus(order_id, status));

        case 5:
          response = _context4.sent;
          res.status(200).send(response);
          _context4.next = 12;
          break;

        case 9:
          _context4.prev = 9;
          _context4.t0 = _context4["catch"](2);
          next(_context4.t0);

        case 12:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[2, 9]]);
};

module.exports = {
  getOrders: getOrders,
  getOrderById: getOrderById,
  createOrder: createOrder,
  updateOrderStatus: updateOrderStatus
};