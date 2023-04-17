"use strict";

var _require = require("pg"),
    Client = _require.Client;

var _require2 = require("../config"),
    DB = _require2.DB;

(function _callee() {
  var createDatabase, createCartsTable, createProductsTable, createCartHasProductsTable, createOrdersTable, createUsersTable, createOrderHasProductsTable, createCategoryTable, createUserSessionsTable, addConstraints, dbPostGres, dbECommerceProjectTest;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          createDatabase = "\n    CREATE DATABASE ".concat(DB.PGDATABASE, ";\n  ");
          createCartsTable = "\n    DROP TABLE IF EXISTS public.".concat(DB.CARTS_TABLE, " CASCADE;\n\n    CREATE TABLE IF NOT EXISTS public.").concat(DB.CARTS_TABLE, "\n    (\n        cart_id integer NOT NULL GENERATED ALWAYS AS IDENTITY,\n        user_id integer NOT NULL ,\n        created date NOT NULL,\n        modified date NOT NULL,\n        PRIMARY KEY (cart_id)\n    );\n  ");
          createProductsTable = "\n    DROP TABLE IF EXISTS public.".concat(DB.PRODUCTS_TABLE, " CASCADE;\n\n    CREATE TABLE IF NOT EXISTS public.").concat(DB.PRODUCTS_TABLE, "\n    (\n        product_id integer NOT NULL GENERATED ALWAYS AS IDENTITY,\n        category_id integer NOT NULL,\n        title text NOT NULL,\n        price numeric(5, 2) NOT NULL,\n        description text,\n        PRIMARY KEY (product_id)\n    );\n  ");
          createCartHasProductsTable = "\n    DROP TABLE IF EXISTS public.".concat(DB.CART_HAS_PRODUCTS_TABLE, " CASCADE;\n\n    CREATE TABLE IF NOT EXISTS public.").concat(DB.CART_HAS_PRODUCTS_TABLE, "\n    (\n        cart_id integer NOT NULL,\n        product_id integer NOT NULL,\n        qty integer NOT NULL\n    );\n  ");
          createOrdersTable = "\n    DROP TABLE IF EXISTS public.".concat(DB.ORDERS_TABLE, " CASCADE;\n\n    CREATE TABLE IF NOT EXISTS public.").concat(DB.ORDERS_TABLE, "\n    (\n        order_id integer NOT NULL GENERATED ALWAYS AS IDENTITY,\n        user_id integer NOT NULL,\n        date date NOT NULL,\n        status text NOT NULL,\n        PRIMARY KEY (order_id)\n    );\n  ");
          createUsersTable = "\n    DROP TABLE IF EXISTS public.".concat(DB.USERS_TABLE, " CASCADE;\n\n    CREATE TABLE IF NOT EXISTS public.").concat(DB.USERS_TABLE, "\n    (\n        user_id integer NOT NULL GENERATED ALWAYS AS IDENTITY,\n        fname character varying(20) NOT NULL,\n        lname character varying(20) NOT NULL,\n        email character varying(70) NOT NULL UNIQUE,\n        password text NOT NULL,\n        isAdmin boolean NOT NULL,\n        PRIMARY KEY (user_id)\n    );\n  ");
          createOrderHasProductsTable = "\n    DROP TABLE IF EXISTS public.".concat(DB.ORDER_HAS_PRODUCTS_TABLE, " CASCADE;\n\n    CREATE TABLE IF NOT EXISTS public.").concat(DB.ORDER_HAS_PRODUCTS_TABLE, "\n    (\n        order_id integer NOT NULL,\n        product_id integer NOT NULL,\n        qty integer NOT NULL\n    );\n  ");
          createCategoryTable = "\n    DROP TABLE IF EXISTS public.".concat(DB.CATEGORIES_TABLE, " CASCADE;\n\n    CREATE TABLE IF NOT EXISTS public.").concat(DB.CATEGORIES_TABLE, "\n    (\n        category_id integer NOT NULL GENERATED ALWAYS AS IDENTITY,\n        name text NOT NULL,\n        PRIMARY KEY (category_id)\n    );\n  ");
          createUserSessionsTable = "\n    DROP TABLE IF EXISTS public.".concat(DB.USER_SESSIONS_TABLE, " CASCADE;\n\n    CREATE TABLE IF NOT EXISTS \"").concat(DB.USER_SESSIONS_TABLE, "\" (\n      \"sid\" varchar NOT NULL COLLATE \"default\",\n      \"sess\" json NOT NULL,\n      \"expire\" timestamp(6) NOT NULL\n    )\n    WITH (OIDS=FALSE);\n  ");
          addConstraints = "\n    ALTER TABLE IF EXISTS \"".concat(DB.USER_SESSIONS_TABLE, "\" ADD CONSTRAINT \"session_pkey\" PRIMARY KEY (\"sid\") NOT DEFERRABLE INITIALLY IMMEDIATE;\n\n    CREATE INDEX \"IDX_session_expire\" ON \"").concat(DB.USER_SESSIONS_TABLE, "\" (\"expire\");\n\n\n    ALTER TABLE IF EXISTS public.").concat(DB.CARTS_TABLE, "\n      ADD CONSTRAINT fk_carts_user_id FOREIGN KEY (user_id)\n      REFERENCES public.").concat(DB.USERS_TABLE, " (user_id) MATCH SIMPLE\n      ON UPDATE NO ACTION\n      ON DELETE CASCADE;\n\n    ALTER TABLE IF EXISTS public.").concat(DB.PRODUCTS_TABLE, "\n        ADD FOREIGN KEY (category_id)\n        REFERENCES public.").concat(DB.CATEGORIES_TABLE, " (category_id) MATCH SIMPLE\n        ON UPDATE CASCADE;\n\n    ALTER TABLE IF EXISTS public.").concat(DB.CART_HAS_PRODUCTS_TABLE, "\n        ADD FOREIGN KEY (cart_id)\n        REFERENCES public.").concat(DB.CARTS_TABLE, " (cart_id) MATCH SIMPLE\n        ON UPDATE NO ACTION\n        ON DELETE CASCADE;\n\n\n    ALTER TABLE IF EXISTS public.").concat(DB.CART_HAS_PRODUCTS_TABLE, "\n        ADD FOREIGN KEY (product_id)\n        REFERENCES public.").concat(DB.PRODUCTS_TABLE, " (product_id) MATCH SIMPLE\n        ON UPDATE NO ACTION\n        ON DELETE CASCADE;\n\n    ALTER TABLE IF EXISTS public.").concat(DB.ORDERS_TABLE, "\n        ADD FOREIGN KEY (user_id)\n        REFERENCES public.").concat(DB.USERS_TABLE, " (user_id) MATCH SIMPLE\n        ON UPDATE NO ACTION\n        ON DELETE CASCADE;\n\n\n    ALTER TABLE IF EXISTS public.").concat(DB.ORDER_HAS_PRODUCTS_TABLE, "\n        ADD FOREIGN KEY (order_id)\n        REFERENCES public.").concat(DB.ORDERS_TABLE, " (order_id) MATCH SIMPLE\n        ON UPDATE NO ACTION\n        ON DELETE CASCADE;\n\n\n    ALTER TABLE IF EXISTS public.").concat(DB.ORDER_HAS_PRODUCTS_TABLE, "\n        ADD FOREIGN KEY (product_id)\n        REFERENCES public.").concat(DB.PRODUCTS_TABLE, " (product_id) MATCH SIMPLE\n        ON UPDATE NO ACTION\n        ON DELETE CASCADE;\n  ");
          _context.prev = 10;
          // Make a temporary client to connect to postgres in order to create database.
          dbPostGres = new Client({
            user: DB.PGUSER,
            host: DB.PGHOST,
            database: "postgres",
            password: DB.PGPASSWORD,
            port: DB.PGPORT
          }); // Client for actual ecommerce project database.

          dbECommerceProjectTest = new Client({
            user: DB.PGUSER,
            host: DB.PGHOST,
            database: DB.PGDATABASE,
            password: DB.PGPASSWORD,
            port: DB.PGPORT
          });
          /*
          @hazeltonbw, although this script is able to create the schema of the tables, it does not create the database itself.
          You are not doing anything special with the database itself, I think the script is close enough to making it 
          for contributors.
          */

          /*
          @hazeltonbw First we'll connect to postgres in order to create the database. Typically postgres is the default db in PSQL. 
          There is a chance that maybe a contributor doesn't have postgres locally. In which case it's up to the user to execute the SQL
          themselves. You may be thinking this exception might defeat the whole purpose of trying to create the DB locally.
          I agree, and I think I found some stackoverflow articles that offer a good solution, although it will require restructuring the code.I'll
          let you decide! 
          https://stackoverflow.com/questions/20813154/node-postgres-create-database
          */

          _context.prev = 13;
          _context.next = 16;
          return regeneratorRuntime.awrap(dbPostGres.connect());

        case 16:
          _context.next = 18;
          return regeneratorRuntime.awrap(dbPostGres.query(createDatabase));

        case 18:
          _context.next = 23;
          break;

        case 20:
          _context.prev = 20;
          _context.t0 = _context["catch"](13);

          if (_context.t0.code == "42P04") {
            console.error("".concat(DB.PGDATABASE, " already exists"));
          } else {
            console.error(_context.t0);
          }

        case 23:
          _context.prev = 23;
          dbPostGres.end();
          console.debug("Switching from postgres to ".concat(DB.PGDATABASE, "."));
          _context.next = 28;
          return regeneratorRuntime.awrap(dbECommerceProjectTest.connect());

        case 28:
          return _context.finish(23);

        case 29:
          _context.next = 31;
          return regeneratorRuntime.awrap(dbECommerceProjectTest.query(createCartsTable));

        case 31:
          _context.next = 33;
          return regeneratorRuntime.awrap(dbECommerceProjectTest.query(createProductsTable));

        case 33:
          _context.next = 35;
          return regeneratorRuntime.awrap(dbECommerceProjectTest.query(createCartHasProductsTable));

        case 35:
          _context.next = 37;
          return regeneratorRuntime.awrap(dbECommerceProjectTest.query(createOrdersTable));

        case 37:
          _context.next = 39;
          return regeneratorRuntime.awrap(dbECommerceProjectTest.query(createUsersTable));

        case 39:
          _context.next = 41;
          return regeneratorRuntime.awrap(dbECommerceProjectTest.query(createOrderHasProductsTable));

        case 41:
          _context.next = 43;
          return regeneratorRuntime.awrap(dbECommerceProjectTest.query(createCategoryTable));

        case 43:
          _context.next = 45;
          return regeneratorRuntime.awrap(dbECommerceProjectTest.query(createUserSessionsTable));

        case 45:
          _context.next = 47;
          return regeneratorRuntime.awrap(dbECommerceProjectTest.query(addConstraints));

        case 47:
          _context.next = 49;
          return regeneratorRuntime.awrap(dbECommerceProjectTest.end());

        case 49:
          _context.next = 54;
          break;

        case 51:
          _context.prev = 51;
          _context.t1 = _context["catch"](10);
          console.log("ERROR CREATING ONE OR MORE TABLES: ", _context.t1);

        case 54:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[10, 51], [13, 20, 23, 29]]);
})();