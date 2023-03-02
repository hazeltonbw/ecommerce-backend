const pool = require("../db");
const createError = require("http-errors");

const getOrders = async (user_id) => {
  const query = {
    text: `SELECT * FROM orders where user_id = $1`,
    values: [user_id],
  };

  const result = await pool.query(query);
  return result.rows?.length ? result.rows : null;
};

const getOrderById = async (order_id) => {
  const query = {
    text: `SELECT order_id, product_id, qty, date, status
            title, price, c.name as category, description
            FROM order_has_products ohp 
            join products   p using(product_id)
            join orders     o using(order_id)
            join categories c using(category_id)
            where ohp.order_id = $1
    `,
    values: [order_id],
  };

  const result = await pool.query(query);
  return result.rows?.length ? result.rows[0] : null;
};

const createOrder = async (data) => {
  const { user_id, cart_id, date, status } = data;
  // Database Transactions
  // https://node-postgres.com/features/transactions
  // A database transaction ensures that if an error occurred anytime while inserting
  // into "orders" or "order_has_products", then ALL statements get rolled back.
  // In other words, if an error occurred then our database won't get changed.
  // The user will receive an error message stating to try again.
  // Transactions start with a query that just says "BEGIN"
  // Transactions are commited to the database using a query that says "COMMIT"
  // Finally, transactions are rolled back if an error occurred using a query
  // that says "ROLLBACK".
  const client = await pool.getClient();
  try {
    await client.query("BEGIN");
    let query = {
      text: `INSERT INTO orders(user_id, date, status) values($1,$2,$3) RETURNING *`,
      values: [user_id, date, status],
    };

    const order = await client.query(query);
    if (!order.rows?.length) {
      // If the order wasn't returned, then something bad happened.
      // Don't continue with adding products to order_has_products table.
      throw createError.InternalServerError(
        "Unable to process order. Please try again."
      );
    }

    const { order_id } = order.rows[0];
    query = {
      text: `INSERT INTO order_has_products(order_id, product_id, qty)
	SELECT o.order_id, chp.product_id, chp.qty
		FROM cart_has_products chp
		JOIN carts c using(cart_id)
		JOIN orders o using(user_id)
		where c.cart_id = $1 and o.order_id = $2 and user_id = $3 RETURNING product_id, qty;`,
      values: [cart_id, order_id, user_id],
    };

    const orderHasProducts = await client.query(query);
    await client.query("COMMIT");
    if (!orderHasProducts.rows?.length) {
      // something went wrong if nothing was returned, because we already ensured
      // that there are items in the users cart, and our query statement
      // should return an array of products along with their qty
      throw createError.InternalServerError(
        "Unable to process order. Please try again."
      );
    }

    // Finally, if we get all the way here, our order is stored in the database, so return
    // all of the order details.
    return { ...order.rows[0], products: orderHasProducts.rows };
  } catch (err) {
    console.error(err);
    console.error(
      "An error occurred while creating order. Rolling back changes..."
    );
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

const updateOrderStatus = async (order_id, status) => {
  const query = {
    text: `UPDATE orders SET status = $1 WHERE order_id = $2`,
    values: [status, order_id],
  };

  const result = await pool.query(query);
  return result.rows?.length ? result.rows[0] : null;
};

module.exports = {
  getOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
};
