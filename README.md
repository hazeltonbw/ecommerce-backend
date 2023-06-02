# eCommerce Store back-end using Node.js, Express, PostGresSQL

Node/Express REST API to provide typical functionality found in an eCommerce website. Users can create accounts, view products, add products to a cart, and place/view orders.

## Setting up
1. Run the command `npm install` in your terminal to install all of the 
necessary dependencies needed for this app.
2. [Install and setup PostGreSQL server](#postgresql-setup)
3. [Configure environment variable file](#configure-environment-variables)

### PostgreSQL Setup
This project requires a [PostgreSQL](https://www.postgresql.org/) database to be running locally. 
Reference the ERD diagram located in the `resources` folder of this repo to view the structure of the tables. 
You can use [pgAdmin](https://www.pgadmin.org/) to interact with the database manually.


To easily populate your database with the requisite tables, run the command `npm run create-db` in your terminal. 
This will create tables in your database if they do not already exist. 
The configuration for this script can be found in the `setupDatabase.js` 
file located in the root of this project.

If you run into an error where the database cannot be created, 
you will have to create it yourself in the `psql` terminal.

> **Note**: This will be different depending on your machine and PostgreSQL version
```sh
$ sudo su - postgres
postgres@ubuntu:~$ psql
psql (15.3 (Ubuntu 15.3-0ubuntu0.23.04.1))
Type "help" for help.

postgres=# CREATE DATABASE ecommerce_project;
CREATE DATABASE
postgres=# CREATE USER <your_username_here> WITH ENCRYPTED PASSWORD '<your_password_here>';
CREATE ROLE
postgres=# GRANT ALL PRIVILEGES ON DATABASE ecommerce_project TO <your_username_here>;
GRANT
\c ecommerce_project postgres
# You are now connected to database "ecommerce_project" as user "postgres".
ecommerce_project=# GRANT ALL ON SCHEMA public TO <your_username_here>;
GRANT
```

### Configure Environment Variables

This repo includes an `example.env` file that contains important 
environment variables for reference. Make sure to create a `.env` 
file and include all variables found in the `example.env` file, 
replacing the example values with those specific to your environment/needs.

## Running the app

To run locally, make sure to install all of the necessary dependencies:

`npm install`

then run with 

`npm run start`


To easily populate your database with the requisite tables, run the command `npm run create-db` in your terminal. This will create tables in your database if they do not already exist. The configuration for this script can be found in the `setupDatabase.js` file located in the root of this project.

Sample products can be found in /resources/products.sql, run this file in pgAdmin to add sample products to the database.

Once the app is running locally, you can access the API at `http://localhost:<your-port>`

## Stripe 

Stripe uses WebHooks to handle post-payment processing, such as updating the database.
In order to use the webhook in a local environment, you must run a few commands to tell 
Stripe to forward events to the webhook route.

First, make sure you are logged in to the Stripe CLI.
`stripe login`

Then, forward events to the orders route. 
`stripe listen --forward-to localhost:4000/orders/webhook`

We are interested in a couple of events:
1. 'payment_intent.succeeded'
2. 'charge.succeeded'

Errors are handled in the front-end, so we won't worry about that in the back-end.

When these events are triggered, we will update the database with the newly created order.

For production, you will want to [setup an endpoint URL for Stripe to
forward events to.](https://dashboard.stripe.com/test/webhooks/create?endpoint_location=hosted)

# Todo / WIP

- [x] [Database Schema and Seed](https://github.com/hazeltonbw/ecommerce-backend/issues/5)
- [x] Middleware
- [x] Cart
- [x] Checkout
- [ ] Orders
- [ ] Testing
