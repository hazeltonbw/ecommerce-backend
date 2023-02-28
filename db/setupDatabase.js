const { Client } = require("pg");
const { DB } = require("../config");

(async () => {
  const createDatabase = `
    CREATE DATABASE ${DB.PGDATABASE};
  `;

  const createCartsTable = `
    DROP TABLE IF EXISTS public.${DB.CARTS_TABLE} CASCADE;

    CREATE TABLE IF NOT EXISTS public.${DB.CARTS_TABLE}
    (
        cart_id integer NOT NULL GENERATED ALWAYS AS IDENTITY,
        user_id integer NOT NULL ,
        created date NOT NULL,
        modified date NOT NULL,
        PRIMARY KEY (cart_id)
    );
  `;

  const createProductsTable = `
    DROP TABLE IF EXISTS public.${DB.PRODUCTS_TABLE} CASCADE;

    CREATE TABLE IF NOT EXISTS public.${DB.PRODUCTS_TABLE}
    (
        product_id integer NOT NULL GENERATED ALWAYS AS IDENTITY,
        category_id integer NOT NULL,
        title text NOT NULL,
        price numeric(5, 2) NOT NULL,
        description text,
        PRIMARY KEY (product_id)
    );
  `;

  const createCartHasProductsTable = `
    DROP TABLE IF EXISTS public.${DB.CART_HAS_PRODUCTS_TABLE} CASCADE;

    CREATE TABLE IF NOT EXISTS public.${DB.CART_HAS_PRODUCTS_TABLE}
    (
        cart_id integer NOT NULL,
        product_id integer NOT NULL,
        qty integer NOT NULL
    );
  `;

  const createOrdersTable = `
    DROP TABLE IF EXISTS public.${DB.ORDERS_TABLE} CASCADE;

    CREATE TABLE IF NOT EXISTS public.${DB.ORDERS_TABLE}
    (
        order_id integer NOT NULL GENERATED ALWAYS AS IDENTITY,
        user_id integer NOT NULL,
        date date NOT NULL,
        status text NOT NULL,
        PRIMARY KEY (order_id)
    );
  `;

  const createUsersTable = `
    DROP TABLE IF EXISTS public.${DB.USERS_TABLE} CASCADE;

    CREATE TABLE IF NOT EXISTS public.${DB.USERS_TABLE}
    (
        user_id integer NOT NULL GENERATED ALWAYS AS IDENTITY,
        fname character varying(20) NOT NULL,
        lname character varying(20) NOT NULL,
        email character varying(70) NOT NULL UNIQUE,
        password text NOT NULL,
        isAdmin boolean NOT NULL,
        PRIMARY KEY (user_id)
    );
  `;

  const createOrderHasProductsTable = `
    DROP TABLE IF EXISTS public.${DB.ORDER_HAS_PRODUCTS_TABLE} CASCADE;

    CREATE TABLE IF NOT EXISTS public.${DB.ORDER_HAS_PRODUCTS_TABLE}
    (
        order_id integer NOT NULL,
        product_id integer NOT NULL,
        qty integer NOT NULL
    );
  `;

  const createCategoryTable = `
    DROP TABLE IF EXISTS public.${DB.CATEGORIES_TABLE} CASCADE;

    CREATE TABLE IF NOT EXISTS public.${DB.CATEGORIES_TABLE}
    (
        category_id integer NOT NULL GENERATED ALWAYS AS IDENTITY,
        name text NOT NULL,
        PRIMARY KEY (category_id)
    );
  `;

  const createUserSessionsTable = `
    DROP TABLE IF EXISTS public.${DB.USER_SESSIONS_TABLE} CASCADE;

    CREATE TABLE IF NOT EXISTS "${DB.USER_SESSIONS_TABLE}" (
      "sid" varchar NOT NULL COLLATE "default",
      "sess" json NOT NULL,
      "expire" timestamp(6) NOT NULL
    )
    WITH (OIDS=FALSE);
  `;

  const addConstraints = `
    ALTER TABLE IF EXISTS "${DB.USER_SESSIONS_TABLE}" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

    CREATE INDEX "IDX_session_expire" ON "${DB.USER_SESSIONS_TABLE}" ("expire");


    ALTER TABLE IF EXISTS public.${DB.CARTS_TABLE}
      ADD CONSTRAINT fk_carts_user_id FOREIGN KEY (user_id)
      REFERENCES public.${DB.USERS_TABLE} (user_id) MATCH SIMPLE
      ON UPDATE NO ACTION
      ON DELETE NO ACTION;

    ALTER TABLE IF EXISTS public.${DB.PRODUCTS_TABLE}
        ADD FOREIGN KEY (category_id)
        REFERENCES public.${DB.CATEGORIES_TABLE} (category_id) MATCH SIMPLE
        ON UPDATE NO ACTION;

    ALTER TABLE IF EXISTS public.${DB.CART_HAS_PRODUCTS_TABLE}
        ADD FOREIGN KEY (cart_id)
        REFERENCES public.${DB.CARTS_TABLE} (cart_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION;


    ALTER TABLE IF EXISTS public.${DB.CART_HAS_PRODUCTS_TABLE}
        ADD FOREIGN KEY (product_id)
        REFERENCES public.${DB.PRODUCTS_TABLE} (product_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION;

    ALTER TABLE IF EXISTS public.${DB.ORDERS_TABLE}
        ADD FOREIGN KEY (user_id)
        REFERENCES public.${DB.USERS_TABLE} (user_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION;


    ALTER TABLE IF EXISTS public.${DB.ORDER_HAS_PRODUCTS_TABLE}
        ADD FOREIGN KEY (order_id)
        REFERENCES public.${DB.ORDERS_TABLE} (order_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION;


    ALTER TABLE IF EXISTS public.${DB.ORDER_HAS_PRODUCTS_TABLE}
        ADD FOREIGN KEY (product_id)
        REFERENCES public.${DB.PRODUCTS_TABLE} (product_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION;
  `;

  try {
    // Make a temporary client to connect to postgres in order to create database.

    const dbPostGres = new Client({
      user: DB.PGUSER,
      host: DB.PGHOST,
      database: "postgres",
      password: DB.PGPASSWORD,
      port: DB.PGPORT,
    });
    // Client for actual ecommerce project database.
    const dbECommerceProjectTest = new Client({
      user: DB.PGUSER,
      host: DB.PGHOST,
      database: DB.PGDATABASE,
      password: DB.PGPASSWORD,
      port: DB.PGPORT,
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

    try {
      await dbPostGres.connect();
      await dbPostGres.query(createDatabase);
    } catch (error) {
      if (error.code == "42P04") {
        console.error(`${DB.PGDATABASE} already exists`);
      } else {
        console.error(error);
      }
    } finally {
      dbPostGres.end();
      console.debug(`Switching from postgres to ${DB.PGDATABASE}.`);
      await dbECommerceProjectTest.connect();
    }

    // Create tables on database
    await dbECommerceProjectTest.query(createCartsTable);
    await dbECommerceProjectTest.query(createProductsTable);
    await dbECommerceProjectTest.query(createCartHasProductsTable);
    await dbECommerceProjectTest.query(createOrdersTable);
    await dbECommerceProjectTest.query(createUsersTable);
    await dbECommerceProjectTest.query(createOrderHasProductsTable);
    await dbECommerceProjectTest.query(createCategoryTable);
    await dbECommerceProjectTest.query(createUserSessionsTable);
    await dbECommerceProjectTest.query(addConstraints);

    await dbECommerceProjectTest.end();
  } catch (err) {
    console.log("ERROR CREATING ONE OR MORE TABLES: ", err);
  }
})();
