"use strict";

var request = require("supertest");

var app = require("../index"); // create our mockData


var mockData = require("./mockData");

var mockDataInstance = new mockData(); // beforeAll(async () => {
//   await seedDatabase();
// });
// afterAll(async () => {
//   await clearDatabase();
// })

describe("Users route", function () {
  var response; // create test users

  var users = mockDataInstance.createMockUsers(); // change later after registering our test user

  var userId;
  beforeAll(function _callee() {
    return regeneratorRuntime.async(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return regeneratorRuntime.awrap(request(app).post("/auth/register").send(users[0]));

          case 2:
            response = _context.sent;
            userId = response.body.userId;

          case 4:
          case "end":
            return _context.stop();
        }
      }
    });
  });
  afterAll(function _callee2() {
    return regeneratorRuntime.async(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return regeneratorRuntime.awrap(request(app)["delete"]("/users/".concat(userId)));

          case 2:
            response = _context2.sent;

          case 3:
          case "end":
            return _context2.stop();
        }
      }
    });
  });
  var userObject = expect.objectContaining({
    user_id: expect.any(Number),
    fname: expect.any(String),
    lname: expect.any(String),
    email: expect.any(String),
    password: expect.any(String),
    isadmin: expect.any(Boolean)
  });
  var messageObject = expect.objectContaining({
    message: expect.any(String)
  });
  describe("GET /users", function () {
    beforeAll(function _callee3() {
      return regeneratorRuntime.async(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return regeneratorRuntime.awrap(request(app).get("/users"));

            case 2:
              response = _context3.sent;
              userId = response.body[0].user_id;

            case 4:
            case "end":
              return _context3.stop();
          }
        }
      });
    });
    it("should return HTTP 200", function () {
      expect(response.statusCode).toBe(200);
    });
    it("should list all users in json", function _callee4() {
      return regeneratorRuntime.async(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              expect(response.body).toEqual(expect.arrayContaining([userObject]));

            case 1:
            case "end":
              return _context4.stop();
          }
        }
      });
    });
  });
  describe("GET /users/:id", function () {
    describe("given a registered users id", function () {
      beforeAll(function _callee5() {
        var url;
        return regeneratorRuntime.async(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                url = "/users/".concat(userId);
                _context5.next = 3;
                return regeneratorRuntime.awrap(request(app).get(url));

              case 3:
                response = _context5.sent;

              case 4:
              case "end":
                return _context5.stop();
            }
          }
        });
      });
      it("should return HTTP 200", function () {
        expect(response.statusCode).toBe(200);
      });
      it("should return a user object", function () {
        expect(response.body).toEqual(userObject);
      });
    });
    describe("given an id that doesnt exist", function () {
      beforeAll(function _callee6() {
        return regeneratorRuntime.async(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                _context6.next = 2;
                return regeneratorRuntime.awrap(request(app).get("/users/99999999"));

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
      it("should not return a user object", function () {
        expect(response.body).not.toEqual(userObject);
      });
    });
  });
  describe("PUT /users/:id", function () {
    var newPassword = "thisIsANewPassword";
    beforeAll(function _callee7() {
      return regeneratorRuntime.async(function _callee7$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              _context7.next = 2;
              return regeneratorRuntime.awrap(request(app).put("/users/".concat(userId)).send({
                password: newPassword
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
    describe("given a valid user id", function () {
      it("should return HTTP 200", function () {
        expect(response.statusCode).toBe(200);
      });
      it("should return a user object", function () {
        expect(response.body).toEqual(userObject);
      });
    });
    describe("given an invalid id", function () {
      beforeAll(function _callee8() {
        return regeneratorRuntime.async(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                _context8.next = 2;
                return regeneratorRuntime.awrap(request(app).put("/users/9999999").send({
                  password: newPassword
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
      it("should return HTTP 400", function () {
        expect(response.statusCode).toBe(400);
      });
      it("should return an object with property message", function () {
        expect(response.body).toEqual(messageObject);
      });
    });
  });
  describe("DELETE /users/:id", function () {
    beforeAll(function _callee9() {
      return regeneratorRuntime.async(function _callee9$(_context9) {
        while (1) {
          switch (_context9.prev = _context9.next) {
            case 0:
              _context9.next = 2;
              return regeneratorRuntime.awrap(request(app)["delete"]("/users/".concat(userId)));

            case 2:
              response = _context9.sent;

            case 3:
            case "end":
              return _context9.stop();
          }
        }
      });
    });
    describe("given a valid user id", function () {
      it("should return HTTP 200", function () {
        expect(response.statusCode).toBe(200);
      });
      it("should return an object with message property", function () {
        expect(response.body).toEqual(messageObject);
      });
    });
    describe("given an invalid user id", function () {
      beforeAll(function _callee10() {
        return regeneratorRuntime.async(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                _context10.next = 2;
                return regeneratorRuntime.awrap(request(app)["delete"]("/users/999999"));

              case 2:
                response = _context10.sent;

              case 3:
              case "end":
                return _context10.stop();
            }
          }
        });
      });
      it("should return HTTP 404", function () {
        expect(response.statusCode).toBe(404);
      });
      it("should return an object with message property", function () {
        expect(response.body).toEqual(messageObject);
      });
    });
  });
});