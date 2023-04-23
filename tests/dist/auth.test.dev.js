"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var request = require("supertest");

var app = require("../index");

var User = require("../models/user");

var mockData = require("./mockData");

describe("Auth route", function () {
  var response;
  var userId;
  var badBodyData = [{
    email: "testemail@email.com"
  }, // missing password key/value
  {
    password: "testpassword"
  }, // missing email key/value
  {} // missing both email & password key/value
  ];
  var mockDataInstance = new mockData();
  var users = mockDataInstance.createMockUsers();
  var userObjectWithCart = {
    user_id: expect.any(Number),
    fname: expect.any(String),
    lname: expect.any(String),
    email: expect.any(String),
    password: expect.any(String),
    isadmin: expect.any(Boolean),
    cart_id: expect.any(Number),
    modified: expect.any(String),
    created: expect.any(String)
  };
  var userObject = {
    user_id: expect.any(Number),
    fname: expect.any(String),
    lname: expect.any(String),
    email: expect.any(String),
    password: expect.any(String),
    isadmin: expect.any(Boolean)
  }; // afterEach(async () => {
  //   // after each test make sure our mock user doesn't exist.
  //   // this will ensure every test has a fresh start
  //   // and doesn't rely on stale data
  //   const userToDelete = await User.findUserByEmail(body.email);
  //   if (userToDelete) {
  //     await User.deleteUserById(userToDelete.user_id);
  //   }
  // });

  describe("POST /register", function () {
    // register our test user
    beforeAll(function _callee() {
      return regeneratorRuntime.async(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return regeneratorRuntime.awrap(request(app).post("/auth/register").send(users[0]));

            case 2:
              response = _context.sent;

            case 3:
            case "end":
              return _context.stop();
          }
        }
      });
    });
    describe("given a username and password in the body", function () {
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
      it("should return user information in the response body", function () {
        expect(response.body).toEqual(userObjectWithCart);
      });
    });
    describe("when the user already exists", function () {
      beforeAll(function _callee3() {
        return regeneratorRuntime.async(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return regeneratorRuntime.awrap(request(app).post("/auth/register").send(users[0]));

              case 2:
                response = _context3.sent;
                userId = response.body.user_id; // run again as to replicate "duplicating" user
                // store in response so we can test against it

                _context3.next = 6;
                return regeneratorRuntime.awrap(request(app).post("/auth/register").send(users[0]));

              case 6:
                response = _context3.sent;

              case 7:
              case "end":
                return _context3.stop();
            }
          }
        });
      });
      afterAll(function _callee4() {
        return regeneratorRuntime.async(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.next = 2;
                return regeneratorRuntime.awrap(request(app)["delete"]("/users/".concat(userId)));

              case 2:
              case "end":
                return _context4.stop();
            }
          }
        });
      });
      it("should return HTTP 409 with error message in body", function _callee5() {
        return regeneratorRuntime.async(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                // throw createError(409, `User with email: ${email} already exists!`);
                expect(response.statusCode).toBe(409);

              case 1:
              case "end":
                return _context5.stop();
            }
          }
        });
      });
      it("should return an object for the body", function () {
        expect(_typeof(response.body)).toBe("object");
      });
      it("should return a property in the body named message", function () {
        expect(response.body).toHaveProperty("message", "User with email: ".concat(users[0].email, " already exists!"));
      });
    });
    describe("when email or password info is missing", function () {
      it("should return HTTP 400 with error message", function _callee6() {
        var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, body, _response;

        return regeneratorRuntime.async(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                _iteratorNormalCompletion = true;
                _didIteratorError = false;
                _iteratorError = undefined;
                _context6.prev = 3;
                _iterator = badBodyData[Symbol.iterator]();

              case 5:
                if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                  _context6.next = 16;
                  break;
                }

                body = _step.value;
                _context6.next = 9;
                return regeneratorRuntime.awrap(request(app).post("/auth/register").send(body));

              case 9:
                _response = _context6.sent;
                expect(_response.statusCode).toBe(400);
                expect(_typeof(_response.body)).toBe("object");
                expect(_response.body).toHaveProperty("message", "Missing email or password information!");

              case 13:
                _iteratorNormalCompletion = true;
                _context6.next = 5;
                break;

              case 16:
                _context6.next = 22;
                break;

              case 18:
                _context6.prev = 18;
                _context6.t0 = _context6["catch"](3);
                _didIteratorError = true;
                _iteratorError = _context6.t0;

              case 22:
                _context6.prev = 22;
                _context6.prev = 23;

                if (!_iteratorNormalCompletion && _iterator["return"] != null) {
                  _iterator["return"]();
                }

              case 25:
                _context6.prev = 25;

                if (!_didIteratorError) {
                  _context6.next = 28;
                  break;
                }

                throw _iteratorError;

              case 28:
                return _context6.finish(25);

              case 29:
                return _context6.finish(22);

              case 30:
              case "end":
                return _context6.stop();
            }
          }
        }, null, null, [[3, 18, 22, 30], [23,, 25, 29]]);
      });
    });
  });
  describe("POST /login/password", function () {
    describe("when the username doesn't exist in the database", function () {
      // throw createError(401, "Incorrect username or password");
      var response;
      beforeAll(function _callee7() {
        return regeneratorRuntime.async(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                _context7.next = 2;
                return regeneratorRuntime.awrap(request(app).post("/auth/login/password").send({
                  email: "thisEmailDoesntExist@DoesntExist.com",
                  password: "password"
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
      it("should return HTTP 401", function _callee8() {
        return regeneratorRuntime.async(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                expect(response.statusCode).toBe(401);

              case 1:
              case "end":
                return _context8.stop();
            }
          }
        });
      });
      it("should have a property named message in the body", function () {
        expect(response.body).toHaveProperty("message", "Incorrect username or password");
      });
    });
    describe("when the password doesn't match in the database", function () {
      var response;
      beforeAll(function _callee9() {
        return regeneratorRuntime.async(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                _context9.next = 2;
                return regeneratorRuntime.awrap(request(app).post("/auth/register").send(users[0]));

              case 2:
                response = _context9.sent;
                userId = response.body.user_id; // Then send a bad password with the new users email

                _context9.next = 6;
                return regeneratorRuntime.awrap(request(app).post("/auth/login/password").send({
                  email: users[0].email,
                  password: "thisPasswordDoesntWork"
                }));

              case 6:
                response = _context9.sent;

              case 7:
              case "end":
                return _context9.stop();
            }
          }
        });
      });
      afterAll(function _callee10() {
        return regeneratorRuntime.async(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                _context10.next = 2;
                return regeneratorRuntime.awrap(request(app)["delete"]("/users/".concat(userId)));

              case 2:
              case "end":
                return _context10.stop();
            }
          }
        });
      }); // afterAll(async () => {
      //   await request(app).delete(`/users/${userId}`);
      // });

      it("should return HTTP 401", function () {
        expect(response.statusCode).toBe(401);
      });
      it("should return an object for the body", function () {
        expect(_typeof(response.body)).toBe("object");
      });
      it("should return a property in the body named message", function () {
        expect(response.body).toHaveProperty("message", "Incorrect username or password");
      });
    });
    describe("when the given credentials from the user match the database", function () {
      beforeAll(function _callee11() {
        return regeneratorRuntime.async(function _callee11$(_context11) {
          while (1) {
            switch (_context11.prev = _context11.next) {
              case 0:
                _context11.next = 2;
                return regeneratorRuntime.awrap(request(app).post("/auth/register").send(users[0]));

              case 2:
                response = _context11.sent;
                userId = response.body.user_id;
                _context11.next = 6;
                return regeneratorRuntime.awrap(request(app).post("/auth/login/password").send(users[0]));

              case 6:
                response = _context11.sent;

              case 7:
              case "end":
                return _context11.stop();
            }
          }
        });
      });
      afterAll(function _callee12() {
        return regeneratorRuntime.async(function _callee12$(_context12) {
          while (1) {
            switch (_context12.prev = _context12.next) {
              case 0:
                _context12.next = 2;
                return regeneratorRuntime.awrap(request(app)["delete"]("/users/".concat(userId)));

              case 2:
              case "end":
                return _context12.stop();
            }
          }
        });
      });
      it("should return HTTP 200", function _callee13() {
        return regeneratorRuntime.async(function _callee13$(_context13) {
          while (1) {
            switch (_context13.prev = _context13.next) {
              case 0:
                expect(response.statusCode).toBe(200);

              case 1:
              case "end":
                return _context13.stop();
            }
          }
        });
      });
      it("should return an object containing the user info", function () {
        expect(response.body).toEqual(userObject);
      });
    });
    describe("when there is no info sent at all", function () {
      var response;
      beforeAll(function _callee14() {
        return regeneratorRuntime.async(function _callee14$(_context14) {
          while (1) {
            switch (_context14.prev = _context14.next) {
              case 0:
                _context14.next = 2;
                return regeneratorRuntime.awrap(request(app).post("/auth/register").send({}));

              case 2:
                response = _context14.sent;

              case 3:
              case "end":
                return _context14.stop();
            }
          }
        });
      });
      it("should return HTTP 400", function () {
        expect(response.statusCode).toBe(400);
      });
      it("should return a property in the body named message", function () {
        expect(response.body).toHaveProperty("message", "Missing email or password information!");
      });
    });
  });
  describe("POST /logout", function () {
    var response;
    beforeAll(function _callee15() {
      return regeneratorRuntime.async(function _callee15$(_context15) {
        while (1) {
          switch (_context15.prev = _context15.next) {
            case 0:
              _context15.next = 2;
              return regeneratorRuntime.awrap(request(app).post("/auth/logout"));

            case 2:
              response = _context15.sent;

            case 3:
            case "end":
              return _context15.stop();
          }
        }
      });
    });
    it("should return HTTP 302", function () {
      // HTTP 302 - Moved
      expect(response.statusCode).toBe(302);
    });
  });
});