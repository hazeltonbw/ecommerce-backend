/*
  Seeds the database for testing purposes
*/
const { Client } = require("pg");
const { DB } = require("../config");
const mockData = require("../tests/mockData");
const pgp = require("pg-promise")();
const dotenv = require("dotenv").config({
  path: "../.env",
});

const insertOverrideSystemValueIntoQuery = (query) => {
  // hack to override system values, pg-promise doesn't seem to have documentation
  // on how to add override system value so since the pgp helper insert function
  // just returns a string lets modify it!
  // This will ensure our data gets the same id's in the database everytime
  //
  const overrideStatement = " OVERRIDING SYSTEM VALUE";
  let insertOverrideStatementAfter = query.indexOf(")");
  return (
    query.slice(0, insertOverrideStatementAfter + 1) +
    overrideStatement +
    query.slice(insertOverrideStatementAfter + 1)
  );
};

// First clear all the tables to ensure we have a clean slate
const clearUsersTable = `DELETE FROM users`;
const clearProductsTable = `DELETE FROM products`;
const clearOrdersTable = `DELETE FROM orders`;
const clearCategoriesTable = `DELETE FROM categories`;
const clearCartsTable = `DELETE FROM carts`;
const clearCartHasProductsTable = `DELETE FROM cart_has_products`;
const clearOrderHasProductsTable = `DELETE FROM order_has_products`;

const seedDatabase = async () => {
  // Create all the mock data given the mockData class
  const mockDataInstance = new mockData();

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
  const users = mockDataInstance.createMockUsers();
  let cs = new pgp.helpers.ColumnSet(
    ["user_id", "fname", "lname", "email", "password"],
    { table: DB.USERS_TABLE }
  );
  let seedUsersTable = pgp.helpers.insert(users, cs);
  seedUsersTable = insertOverrideSystemValueIntoQuery(seedUsersTable);

  const categories = mockDataInstance.createMockCategories();
  cs = new pgp.helpers.ColumnSet(["category_id", "name"], {
    table: DB.CATEGORIES_TABLE,
  });
  let seedCategoriesTable = pgp.helpers.insert(categories, cs);
  seedCategoriesTable = insertOverrideSystemValueIntoQuery(seedCategoriesTable);

  const products = mockDataInstance.createMockProducts();
  cs = new pgp.helpers.ColumnSet(
    ["product_id", "category_id", "title", "price", "description"],
    {
      table: DB.PRODUCTS_TABLE,
    }
  );
  let seedProductsTable = pgp.helpers.insert(products, cs);
  seedProductsTable = insertOverrideSystemValueIntoQuery(seedProductsTable);

  const orders = mockDataInstance.createMockOrders();
  cs = new pgp.helpers.ColumnSet(["order_id", "user_id", "date", "status"], {
    table: DB.ORDERS_TABLE,
  });
  let seedOrdersTable = pgp.helpers.insert(orders, cs);
  seedOrdersTable = insertOverrideSystemValueIntoQuery(seedOrdersTable);

  const carts = mockDataInstance.createMockCarts();
  cs = new pgp.helpers.ColumnSet(["cart_id", "created", "modified"], {
    table: DB.CARTS_TABLE,
  });
  let seedCartsTable = pgp.helpers.insert(carts, cs);
  seedCartsTable = insertOverrideSystemValueIntoQuery(seedCartsTable);

  const cartHasProduct = mockDataInstance.createMockCartHasProducts();
  cs = new pgp.helpers.ColumnSet(["cart_id", "product_id", "qty"], {
    table: DB.CART_HAS_PRODUCTS_TABLE,
  });
  let seedCartHasProductsTable = pgp.helpers.insert(cartHasProduct, cs);
  seedCartHasProductsTable = insertOverrideSystemValueIntoQuery(
    seedCartHasProductsTable
  );

  const orderHasProduct = mockDataInstance.createMockOrderHasProducts();
  cs = new pgp.helpers.ColumnSet(["order_id", "product_id", "qty"], {
    table: DB.ORDER_HAS_PRODUCTS_TABLE,
  });
  let seedOrderHasProductsTable = pgp.helpers.insert(orderHasProduct, cs);
  seedOrderHasProductsTable = insertOverrideSystemValueIntoQuery(
    seedOrderHasProductsTable
  );

  // Client for actual ecommerce project database.
  const dbECommerceProjectTest = new Client({
    user: DB.PGUSER,
    host: DB.PGHOST,
    database: DB.PGDATABASE,
    password: DB.PGPASSWORD,
    port: DB.PGPORT,
  });
  try {
    try {
      await dbECommerceProjectTest.connect();
    } catch (error) {
      console.error(`There was an issue connecting ${DB.PGDATABASE}: ` + error);
    }
    // Clear data in tables. That way it can be used to refresh the db.
    await dbECommerceProjectTest.query(clearUsersTable);
    await dbECommerceProjectTest.query(clearProductsTable);
    await dbECommerceProjectTest.query(clearOrdersTable);
    await dbECommerceProjectTest.query(clearCategoriesTable);
    await dbECommerceProjectTest.query(clearCartsTable);
    await dbECommerceProjectTest.query(clearCartHasProductsTable);
    await dbECommerceProjectTest.query(clearOrderHasProductsTable);

    // Seed tables on database
    await dbECommerceProjectTest.query(seedUsersTable);
    await dbECommerceProjectTest.query(seedCategoriesTable);
    await dbECommerceProjectTest.query(seedProductsTable);
    await dbECommerceProjectTest.query(seedOrdersTable);
    await dbECommerceProjectTest.query(seedCartsTable);
    await dbECommerceProjectTest.query(seedCartHasProductsTable);
    await dbECommerceProjectTest.query(seedOrderHasProductsTable);
  } catch (err) {
    console.log("ERROR SEEDING ONE OR MORE TABLES: ", err);
  } finally {
    await dbECommerceProjectTest.end();
  }
};

const clearDatabase = async () => {
  const dbECommerceProjectTest = new Client({
    user: DB.PGUSER,
    host: DB.PGHOST,
    database: DB.PGDATABASE,
    password: DB.PGPASSWORD,
    port: DB.PGPORT,
  });

  try {
    try {
      await dbECommerceProjectTest.connect();
    } catch (error) {
      console.error(`There was an issue connecting ${DB.PGDATABASE}: ` + error);
    }
    //Clear data in tables. That way it can be used to refresh the db.
    await dbECommerceProjectTest.query(clearUsersTable);
    await dbECommerceProjectTest.query(clearProductsTable);
    await dbECommerceProjectTest.query(clearOrdersTable);
    await dbECommerceProjectTest.query(clearCategoriesTable);
    await dbECommerceProjectTest.query(clearCartsTable);
    await dbECommerceProjectTest.query(clearCartItemsTable);
  } catch (err) {
    console.log("ERROR CLEARING ONE OR MORE TABLES: ", err);
  } finally {
    await dbECommerceProjectTest.end();
  }
};

module.exports = { seedDatabase, clearDatabase };
// https://developer.mozilla.org/en-US/docs/Glossary/IIFE
// Use IIFE to call seedDatabase
(async () => {
  await seedDatabase();
})();
