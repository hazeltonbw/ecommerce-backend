"use strict";

var expressLoader = require("./express");

var passportLoader = require("./passport");

var routeLoader = require("../routes"); //const swaggerLoader = require('./swagger');
//const swagger = require('./swagger');


module.exports = function _callee(app) {
  var expressApp, passport;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(expressLoader(app));

        case 2:
          expressApp = _context.sent;
          _context.next = 5;
          return regeneratorRuntime.awrap(passportLoader(expressApp));

        case 5:
          passport = _context.sent;
          // Load API route handlers
          routeLoader(app, passport); // Load Swagger
          //await swaggerLoader(app);
          // Error Handler

          app.use(function (err, req, res, next) {
            var message = err.message;
            var status = err.status || 500;
            return res.status(status).send({
              message: message
            });
          });

        case 8:
        case "end":
          return _context.stop();
      }
    }
  });
};