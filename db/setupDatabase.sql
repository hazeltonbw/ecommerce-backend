-- This script was generated by the ERD tool in pgAdmin 4.
-- Please log an issue at https://redmine.postgresql.org/projects/pgadmin4/issues/new if you find any bugs, including reproduction steps.
BEGIN;


DROP TABLE IF EXISTS public.cart;

CREATE TABLE IF NOT EXISTS public.cart
(
    cart_id integer NOT NULL GENERATED ALWAYS AS IDENTITY,
    created date NOT NULL,
    modified date NOT NULL,
    PRIMARY KEY (cart_id)
);

DROP TABLE IF EXISTS public.product;

CREATE TABLE IF NOT EXISTS public.product
(
    product_id integer NOT NULL GENERATED ALWAYS AS IDENTITY,
    category_id integer NOT NULL,
    title text NOT NULL,
    price numeric(5, 2) NOT NULL,
    description text,
    PRIMARY KEY (product_id)
);

DROP TABLE IF EXISTS public.cart_has_products;

CREATE TABLE IF NOT EXISTS public.cart_has_products
(
    cart_id integer NOT NULL,
    product_id integer NOT NULL,
    qty integer NOT NULL
);

DROP TABLE IF EXISTS public."order";

CREATE TABLE IF NOT EXISTS public."order"
(
    order_id integer NOT NULL GENERATED ALWAYS AS IDENTITY,
    user_id integer NOT NULL,
    date date NOT NULL,
    status text NOT NULL,
    PRIMARY KEY (order_id)
);

DROP TABLE IF EXISTS public."user";

CREATE TABLE IF NOT EXISTS public."user"
(
    user_id integer NOT NULL GENERATED ALWAYS AS IDENTITY,
    cart_id integer,
    fname character varying(20),
    lname character varying(20),
    email character varying(70),
    PRIMARY KEY (user_id)
);

DROP TABLE IF EXISTS public.order_has_product;

CREATE TABLE IF NOT EXISTS public.order_has_product
(
    order_id integer NOT NULL,
    product_id integer NOT NULL,
    qty integer NOT NULL
);

DROP TABLE IF EXISTS public.category;

CREATE TABLE IF NOT EXISTS public.category
(
    category_id integer NOT NULL GENERATED ALWAYS AS IDENTITY,
    name text NOT NULL,
    PRIMARY KEY (category_id)
);

DROP TABLE IF EXISTS public.user_sessions;

CREATE TABLE IF NOT EXISTS "user_sessions" (
  "sid" varchar NOT NULL COLLATE "default",
  "sess" json NOT NULL,
  "expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);

ALTER TABLE IF EXISTS "user_sessions" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

CREATE INDEX "IDX_session_expire" ON "user_sessions" ("expire");

ALTER TABLE IF EXISTS public.product
    ADD FOREIGN KEY (category_id)
    REFERENCES public.category (category_id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE CASCADE
    NOT VALID;


ALTER TABLE IF EXISTS public.cart_has_products
    ADD FOREIGN KEY (cart_id)
    REFERENCES public.cart (cart_id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE CASCADE
    NOT VALID;


ALTER TABLE IF EXISTS public.cart_has_products
    ADD FOREIGN KEY (product_id)
    REFERENCES public.product (product_id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE CASCADE
    NOT VALID;


ALTER TABLE IF EXISTS public."order"
    ADD FOREIGN KEY (user_id)
    REFERENCES public."user" (user_id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE CASCADE
    NOT VALID;


ALTER TABLE IF EXISTS public."user"
    ADD FOREIGN KEY (cart_id)
    REFERENCES public.cart (cart_id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE CASCADE
    NOT VALID;


ALTER TABLE IF EXISTS public.order_has_product
    ADD FOREIGN KEY (order_id)
    REFERENCES public."order" (order_id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE CASCADE
    NOT VALID;


ALTER TABLE IF EXISTS public.order_has_product
    ADD FOREIGN KEY (product_id)
    REFERENCES public.product (product_id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE CASCADE
    NOT VALID;

END;