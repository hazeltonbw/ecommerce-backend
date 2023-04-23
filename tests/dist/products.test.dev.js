"use strict";

var request = require("supertest");

var app = require("../index");

var mockData = require("./mockData");

var mockDataInstance = new mockData();
describe.only("Products route", function () {
  // variable setup needed to test product route
  var response;
  var productId = 0;
  var products = mockDataInstance.createMockProducts();
  var productObject = expect.objectContaining({
    product_id: expect.any(Number),
    category_id: expect.any(Number),
    title: expect.any(String),
    price: expect.any(String),
    description: expect.any(String)
  });
  var arrayOfProducts = expect.arrayContaining([productObject]);
  var emptyObject = expect.objectContaining({});
  var emptyArray = expect.arrayContaining([]);
  var badUrls = ["/products?category=wgwergrwgrgreg", "/products?name=rgkjergiergreger", "/products?name=3230222g2", "/products?name=_________123"];
  describe("GET /products", function () {
    beforeAll(function _callee() {
      return regeneratorRuntime.async(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return regeneratorRuntime.awrap(request(app).get("/products"));

            case 2:
              response = _context.sent;
              productId = response.body[0].product_id;

            case 4:
            case "end":
              return _context.stop();
          }
        }
      });
    });
    it("should return HTTP 200", function _callee2() {
      return regeneratorRuntime.async(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              expect(response.statusCode).toBe(200);

            case 1:
            case "end":
              return _context2.stop();
          }
        }
      });
    });
    it("should return an array of products", function () {
      expect(response.body).toEqual(arrayOfProducts);
    });
  });
  describe("GET /products?query=something", function () {
    // two queries could be possible, name and category
    // see urls object above to see possible queries
    describe("given a query that matches something in the database", function () {
      it("should ", function _callee3() {
        var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, product;

        return regeneratorRuntime.async(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _iteratorNormalCompletion = true;
                _didIteratorError = false;
                _iteratorError = undefined;
                _context3.prev = 3;
                _iterator = products[Symbol.iterator]();

              case 5:
                if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                  _context3.next = 16;
                  break;
                }

                product = _step.value;
                // Test title
                url = "/products?query=".concat(product.title);
                _context3.next = 10;
                return regeneratorRuntime.awrap(request(app).get(url));

              case 10:
                response = _context3.sent;
                expect(response.statusCode).toBe(200);
                expect(response.body).toEqual(arrayOfProducts);

              case 13:
                _iteratorNormalCompletion = true;
                _context3.next = 5;
                break;

              case 16:
                _context3.next = 22;
                break;

              case 18:
                _context3.prev = 18;
                _context3.t0 = _context3["catch"](3);
                _didIteratorError = true;
                _iteratorError = _context3.t0;

              case 22:
                _context3.prev = 22;
                _context3.prev = 23;

                if (!_iteratorNormalCompletion && _iterator["return"] != null) {
                  _iterator["return"]();
                }

              case 25:
                _context3.prev = 25;

                if (!_didIteratorError) {
                  _context3.next = 28;
                  break;
                }

                throw _iteratorError;

              case 28:
                return _context3.finish(25);

              case 29:
                return _context3.finish(22);

              case 30:
              case "end":
                return _context3.stop();
            }
          }
        }, null, null, [[3, 18, 22, 30], [23,, 25, 29]]);
      });
    });
    describe("given a query that doesnt match something in the database", function () {
      it("should ", function _callee4() {
        var _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, _url;

        return regeneratorRuntime.async(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _iteratorNormalCompletion2 = true;
                _didIteratorError2 = false;
                _iteratorError2 = undefined;
                _context4.prev = 3;
                _iterator2 = badUrls[Symbol.iterator]();

              case 5:
                if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
                  _context4.next = 15;
                  break;
                }

                _url = _step2.value;
                _context4.next = 9;
                return regeneratorRuntime.awrap(request(app).get(_url));

              case 9:
                response = _context4.sent;
                expect(response.statusCode).toBe(200);
                expect(response.body).toEqual(emptyArray);

              case 12:
                _iteratorNormalCompletion2 = true;
                _context4.next = 5;
                break;

              case 15:
                _context4.next = 21;
                break;

              case 17:
                _context4.prev = 17;
                _context4.t0 = _context4["catch"](3);
                _didIteratorError2 = true;
                _iteratorError2 = _context4.t0;

              case 21:
                _context4.prev = 21;
                _context4.prev = 22;

                if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
                  _iterator2["return"]();
                }

              case 24:
                _context4.prev = 24;

                if (!_didIteratorError2) {
                  _context4.next = 27;
                  break;
                }

                throw _iteratorError2;

              case 27:
                return _context4.finish(24);

              case 28:
                return _context4.finish(21);

              case 29:
              case "end":
                return _context4.stop();
            }
          }
        }, null, null, [[3, 17, 21, 29], [22,, 24, 28]]);
      });
    });
  });
  describe("GET /products/:id", function () {
    describe("given a valid id", function () {
      beforeAll(function _callee5() {
        return regeneratorRuntime.async(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.next = 2;
                return regeneratorRuntime.awrap(request(app).get("/products/".concat(productId)));

              case 2:
                response = _context5.sent;

              case 3:
              case "end":
                return _context5.stop();
            }
          }
        });
      });
      it("should return HTTP 200", function () {
        expect(response.statusCode).toBe(200);
      });
      it("should return a single product object", function () {
        expect(response.body).toEqual(productObject);
      });
    });
    describe("given an invalid id", function () {
      beforeAll(function _callee6() {
        return regeneratorRuntime.async(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                _context6.next = 2;
                return regeneratorRuntime.awrap(request(app).get("/products/1999999999"));

              case 2:
                response = _context6.sent;

              case 3:
              case "end":
                return _context6.stop();
            }
          }
        });
      });
      it("should return HTTP 200", function () {
        expect(response.statusCode).toBe(200);
      });
      it("should return an empty object", function () {
        expect(response.body).toEqual(emptyObject);
      });
    });
  });
  describe("PUT /products/:id", function () {
    describe("given a bad id", function () {
      beforeAll(function _callee7() {
        return regeneratorRuntime.async(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                _context7.next = 2;
                return regeneratorRuntime.awrap(request(app).put("/products/1999999999").send({
                  name: "Great product name",
                  price: 350.0,
                  description: "What a great description",
                  category: "Fishing"
                }));

              case 2:
                response = _context7.sent;

              case 3:
              case "end":
                return _context7.stop();
            }
          }
        });
      });
      it("should return HTTP 400", function () {
        expect(response.statusCode).toBe(400);
      });
      it("should return an object with message property", function () {
        expect(response.body).toEqual(expect.objectContaining({
          message: expect.any(String)
        }));
      });
    });
    describe("given a valid id", function () {
      beforeAll(function _callee8() {
        return regeneratorRuntime.async(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                _context8.next = 2;
                return regeneratorRuntime.awrap(request(app).put("/products/".concat(productId)).send({
                  name: "Great product name",
                  price: 350.0,
                  description: "What a great description"
                }));

              case 2:
                response = _context8.sent;

              case 3:
              case "end":
                return _context8.stop();
            }
          }
        });
      });
      it("should return HTTP 200", function () {
        expect(response.statusCode).toBe(200);
      });
      it("should return the updated products object", function () {
        expect(response.body).toEqual(productObject);
      });
    });
  });
  describe("DELETE /products/:id", function () {
    describe("given a bad id", function () {
      beforeAll(function _callee9() {
        return regeneratorRuntime.async(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                _context9.next = 2;
                return regeneratorRuntime.awrap(request(app)["delete"]("/products/1999999999"));

              case 2:
                response = _context9.sent;

              case 3:
              case "end":
                return _context9.stop();
            }
          }
        });
      });
      it("should return HTTP 400", function () {
        expect(response.statusCode).toBe(400);
      });
      it("should return an object with message property", function () {
        expect(response.body).toEqual(expect.objectContaining({
          message: expect.any(String)
        }));
      });
    });
    describe("given a valid id", function () {
      beforeAll(function _callee10() {
        return regeneratorRuntime.async(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                _context10.next = 2;
                return regeneratorRuntime.awrap(request(app)["delete"]("/products/".concat(productId)));

              case 2:
                response = _context10.sent;

              case 3:
              case "end":
                return _context10.stop();
            }
          }
        });
      });
      it("should return HTTP 204", function () {
        expect(response.statusCode).toBe(204);
      });
      it("should return nothing in the body", function () {
        expect(response.body).toEqual(emptyObject);
      });
    });
  });
});