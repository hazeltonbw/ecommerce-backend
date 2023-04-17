"use strict";

/*
  Seeds the database for testing purposes
*/
var _require = require("pg"),
    Client = _require.Client;

var _require2 = require("../config"),
    DB = _require2.DB;

var mockData = require("../tests/mockData");

var pgp = require("pg-promise")();

var dotenv = require("dotenv").config({
  path: "../.env"
});

var insertOverrideSystemValueIntoQuery = function insertOverrideSystemValueIntoQuery(query) {
  // hack to override system values, pg-promise doesn't seem to have documentation
  // on how to add override system value so since the pgp helper insert function
  // just returns a string lets modify it!
  // This will ensure our data gets the same id's in the database everytime
  //
  var overrideStatement = " OVERRIDING SYSTEM VALUE";
  var insertOverrideStatementAfter = query.indexOf(")");
  return query.slice(0, insertOverrideStatementAfter + 1) + overrideStatement + query.slice(insertOverrideStatementAfter + 1);
}; // First clear all the tables to ensure we have a clean slate


var clearUsersTable = "DELETE FROM users";
var clearProductsTable = "DELETE FROM products";
var clearOrdersTable = "DELETE FROM orders";
var clearCategoriesTable = "DELETE FROM categories";
var clearCartsTable = "DELETE FROM carts";
var clearCartHasProductsTable = "DELETE FROM cart_has_products";
var clearOrderHasProductsTable = "DELETE FROM order_has_products";

var seedDatabase = function seedDatabase() {
  var mockDataInstance, users, cs, seedUsersTable, categories, seedCategoriesTable, products, seedProductsTable, orders, seedOrdersTable, carts, seedCartsTable, cartHasProduct, seedCartHasProductsTable, orderHasProduct, seedOrderHasProductsTable, dbECommerceProjectTest;
  return regeneratorRuntime.async(function seedDatabase$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          // Create all the mock data given the mockData class
          mockDataInstance = new mockData();
          /* use pg-promise to help streamline the process,
            and to help not repeat ourselves
            this also allows us to easily change how many mock
            items we want to run in our tests by changing
            the constant 'AMOUNT_OF_MOCKS' 
             insert function allows easy multiple inserts using an array of objects
            that match the database schema
            https://vitaly-t.github.io/pg-promise/helpers.html#.insert
             ColumnSet defines the columns in the table so insert() knows what properties to use
            https://vitaly-t.github.io/pg-promise/helpers.ColumnSet.html
          */
          // mock users

          users = mockDataInstance.createMockUsers();
          cs = new pgp.helpers.ColumnSet(["user_id", "fname", "lname", "email", "password", "isadmin"], {
            table: DB.USERS_TABLE
          });
          seedUsersTable = pgp.helpers.insert(users, cs);
          seedUsersTable = insertOverrideSystemValueIntoQuery(seedUsersTable);
          categories = mockDataInstance.createMockCategories();
          cs = new pgp.helpers.ColumnSet(["category_id", "name"], {
            table: DB.CATEGORIES_TABLE
          });
          seedCategoriesTable = pgp.helpers.insert(categories, cs);
          seedCategoriesTable = insertOverrideSystemValueIntoQuery(seedCategoriesTable);
          products = mockDataInstance.createMockProducts();
          cs = new pgp.helpers.ColumnSet(["product_id", "category_id", "title", "price", "description"], {
            table: DB.PRODUCTS_TABLE
          });
          seedProductsTable = pgp.helpers.insert(products, cs);
          seedProductsTable = insertOverrideSystemValueIntoQuery(seedProductsTable);
          orders = mockDataInstance.createMockOrders();
          cs = new pgp.helpers.ColumnSet(["order_id", "user_id", "date", "status"], {
            table: DB.ORDERS_TABLE
          });
          seedOrdersTable = pgp.helpers.insert(orders, cs);
          seedOrdersTable = insertOverrideSystemValueIntoQuery(seedOrdersTable);
          carts = mockDataInstance.createMockCarts();
          cs = new pgp.helpers.ColumnSet(["cart_id", "created", "modified"], {
            table: DB.CARTS_TABLE
          });
          seedCartsTable = pgp.helpers.insert(carts, cs);
          seedCartsTable = insertOverrideSystemValueIntoQuery(seedCartsTable);
          cartHasProduct = mockDataInstance.createMockCartHasProducts();
          cs = new pgp.helpers.ColumnSet(["cart_id", "product_id", "qty"], {
            table: DB.CART_HAS_PRODUCTS_TABLE
          });
          seedCartHasProductsTable = pgp.helpers.insert(cartHasProduct, cs);
          seedCartHasProductsTable = insertOverrideSystemValueIntoQuery(seedCartHasProductsTable);
          orderHasProduct = mockDataInstance.createMockOrderHasProducts();
          cs = new pgp.helpers.ColumnSet(["order_id", "product_id", "qty"], {
            table: DB.ORDER_HAS_PRODUCTS_TABLE
          });
          seedOrderHasProductsTable = pgp.helpers.insert(orderHasProduct, cs);
          seedOrderHasProductsTable = insertOverrideSystemValueIntoQuery(seedOrderHasProductsTable); // Client for actual ecommerce project database.

          dbECommerceProjectTest = new Client({
            user: DB.PGUSER,
            host: DB.PGHOST,
            database: DB.PGDATABASE,
            password: DB.PGPASSWORD,
            port: DB.PGPORT
          });
          _context.prev = 30;
          _context.prev = 31;
          _context.next = 34;
          return regeneratorRuntime.awrap(dbECommerceProjectTest.connect());

        case 34:
          _context.next = 39;
          break;

        case 36:
          _context.prev = 36;
          _context.t0 = _context["catch"](31);
          console.error("There was an issue connecting ".concat(DB.PGDATABASE, ": ") + _context.t0);

        case 39:
          _context.next = 41;
          return regeneratorRuntime.awrap(dbECommerceProjectTest.query(clearUsersTable));

        case 41:
          _context.next = 43;
          return regeneratorRuntime.awrap(dbECommerceProjectTest.query(clearProductsTable));

        case 43:
          _context.next = 45;
          return regeneratorRuntime.awrap(dbECommerceProjectTest.query(clearOrdersTable));

        case 45:
          _context.next = 47;
          return regeneratorRuntime.awrap(dbECommerceProjectTest.query(clearCategoriesTable));

        case 47:
          _context.next = 49;
          return regeneratorRuntime.awrap(dbECommerceProjectTest.query(clearCartsTable));

        case 49:
          _context.next = 51;
          return regeneratorRuntime.awrap(dbECommerceProjectTest.query(clearCartHasProductsTable));

        case 51:
          _context.next = 53;
          return regeneratorRuntime.awrap(dbECommerceProjectTest.query(clearOrderHasProductsTable));

        case 53:
          _context.next = 55;
          return regeneratorRuntime.awrap(dbECommerceProjectTest.query(seedUsersTable));

        case 55:
          _context.next = 57;
          return regeneratorRuntime.awrap(dbECommerceProjectTest.query(seedCategoriesTable));

        case 57:
          _context.next = 59;
          return regeneratorRuntime.awrap(dbECommerceProjectTest.query(seedProductsTable));

        case 59:
          _context.next = 61;
          return regeneratorRuntime.awrap(dbECommerceProjectTest.query(seedOrdersTable));

        case 61:
          _context.next = 66;
          break;

        case 63:
          _context.prev = 63;
          _context.t1 = _context["catch"](30);
          console.log("ERROR SEEDING ONE OR MORE TABLES: ", _context.t1);

        case 66:
          _context.prev = 66;
          _context.next = 69;
          return regeneratorRuntime.awrap(dbECommerceProjectTest.end());

        case 69:
          return _context.finish(66);

        case 70:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[30, 63, 66, 70], [31, 36]]);
};

var clearDatabase = function clearDatabase() {
  var dbECommerceProjectTest;
  return regeneratorRuntime.async(function clearDatabase$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          dbECommerceProjectTest = new Client({
            user: DB.PGUSER,
            host: DB.PGHOST,
            database: DB.PGDATABASE,
            password: DB.PGPASSWORD,
            port: DB.PGPORT
          });
          _context2.prev = 1;
          _context2.prev = 2;
          _context2.next = 5;
          return regeneratorRuntime.awrap(dbECommerceProjectTest.connect());

        case 5:
          _context2.next = 10;
          break;

        case 7:
          _context2.prev = 7;
          _context2.t0 = _context2["catch"](2);
          console.error("There was an issue connecting ".concat(DB.PGDATABASE, ": ") + _context2.t0);

        case 10:
          _context2.next = 12;
          return regeneratorRuntime.awrap(dbECommerceProjectTest.query(clearUsersTable));

        case 12:
          _context2.next = 14;
          return regeneratorRuntime.awrap(dbECommerceProjectTest.query(clearProductsTable));

        case 14:
          _context2.next = 16;
          return regeneratorRuntime.awrap(dbECommerceProjectTest.query(clearOrdersTable));

        case 16:
          _context2.next = 18;
          return regeneratorRuntime.awrap(dbECommerceProjectTest.query(clearCategoriesTable));

        case 18:
          _context2.next = 20;
          return regeneratorRuntime.awrap(dbECommerceProjectTest.query(clearCartsTable));

        case 20:
          _context2.next = 22;
          return regeneratorRuntime.awrap(dbECommerceProjectTest.query(clearCartItemsTable));

        case 22:
          _context2.next = 27;
          break;

        case 24:
          _context2.prev = 24;
          _context2.t1 = _context2["catch"](1);
          console.log("ERROR CLEARING ONE OR MORE TABLES: ", _context2.t1);

        case 27:
          _context2.prev = 27;
          _context2.next = 30;
          return regeneratorRuntime.awrap(dbECommerceProjectTest.end());

        case 30:
          return _context2.finish(27);

        case 31:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[1, 24, 27, 31], [2, 7]]);
};

module.exports = {
  seedDatabase: seedDatabase,
  clearDatabase: clearDatabase
}; // https://developer.mozilla.org/en-US/docs/Glossary/IIFE
// Use IIFE to call seedDatabase

(function _callee() {
  return regeneratorRuntime.async(function _callee$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return regeneratorRuntime.awrap(seedDatabase());

        case 2:
        case "end":
          return _context3.stop();
      }
    }
  });
})();