"use strict";

var productModel = require("../models/product");

var getProducts = function getProducts(req, res, next) {
  var queryOpts, response;
  return regeneratorRuntime.async(function getProducts$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          queryOpts = req.query;
          _context.prev = 1;
          _context.next = 4;
          return regeneratorRuntime.awrap(productModel.getProducts(queryOpts));

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

var getProductById = function getProductById(req, res, next) {
  var id, response;
  return regeneratorRuntime.async(function getProductById$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          id = parseInt(req.params.id);
          _context2.next = 4;
          return regeneratorRuntime.awrap(productModel.getProductById(id));

        case 4:
          response = _context2.sent;
          res.status(200).send(response);
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

var updateProductById = function updateProductById(req, res, next) {
  var newData, id, response;
  return regeneratorRuntime.async(function updateProductById$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          newData = req.body;
          id = parseInt(req.params.id);
          _context3.next = 5;
          return regeneratorRuntime.awrap(productModel.updateProductById(id, newData));

        case 5:
          response = _context3.sent;
          res.status(200).send(response);
          _context3.next = 12;
          break;

        case 9:
          _context3.prev = 9;
          _context3.t0 = _context3["catch"](0);
          next(_context3.t0);

        case 12:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 9]]);
};

var deleteProductById = function deleteProductById(req, res, next) {
  var id;
  return regeneratorRuntime.async(function deleteProductById$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          id = parseInt(req.params.id);
          _context4.next = 4;
          return regeneratorRuntime.awrap(productModel.deleteProductById(id));

        case 4:
          res.sendStatus(204);
          _context4.next = 10;
          break;

        case 7:
          _context4.prev = 7;
          _context4.t0 = _context4["catch"](0);
          next(_context4.t0);

        case 10:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

var addProduct = function addProduct(req, res, next) {
  var data, response;
  return regeneratorRuntime.async(function addProduct$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          data = req.body;
          _context5.next = 4;
          return regeneratorRuntime.awrap(productModel.addProduct(data));

        case 4:
          response = _context5.sent;
          res.status(200).send(response);
          _context5.next = 11;
          break;

        case 8:
          _context5.prev = 8;
          _context5.t0 = _context5["catch"](0);
          next(_context5.t0);

        case 11:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 8]]);
};

module.exports = {
  getProducts: getProducts,
  getProductById: getProductById,
  updateProductById: updateProductById,
  deleteProductById: deleteProductById,
  addProduct: addProduct
};