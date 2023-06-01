const pool = require("../db");
const createError = require("http-errors");

const getOrders = async (user_id) => {
  const query = {
    //     text: `
    //       select o.order_id, o.date, o.status, ohp.product_id, ohp.qty, 
    //       p.title, p."imgURL" as img, sum(ohp.qty * p.price) as total from orders o
    //       join order_has_products ohp using(order_id)
    //       join products p using(product_id)
    //       where user_id = $1
    //       GROUP BY 1,2,3,4,5,6,7
    //       ORDER BY 1 DESC;
    // `,
    text: `
      select 
        ohp.order_id, o.date, o.status, SUM(ohp.qty * p.price) as order_total,
        json_agg(
          json_build_object(
            'product', p.*,
            'qty', ohp.qty,
            'total', ohp.qty * p.price
          )
        ) AS products
      from order_has_products ohp
      join orders o using(order_id)
      join products p using(product_id)
      where user_id = $1
      group by ohp.order_id, o.date, o.status
      order by o.date desc;
    `,

    //     text: `
    //       select 
    //         ohp.order_id, o.date, o.status, SUM(ohp.qty * p.price) as order_total,
    //           json_build_object(
    //             'product', json_agg(p.*),
    //             'qty', json_agg(ohp.qty),
    //             'total', json_agg(ohp.qty * p.price)
    //           ) AS products
    //       from order_has_products ohp
    //       join orders o using(order_id)
    //       join products p using(product_id)
    //       where user_id = $1
    //       group by ohp.order_id, o.date, o.status
    //       order by o.date desc;

    // `,
    values: [user_id],
  };

  const result = await pool.query(query);
  return result.rows?.length ? result.rows : null;
};

const getOrderById = async (data) => {

  const { user_id, order_id } = data;
  const query = {
    // text: `SELECT order_id, product_id, qty, date, status
    //         title, price, c.name as category, description
    //         FROM order_has_products ohp 
    //         join products   p using(product_id)
    //         join orders     o using(order_id)
    //         join categories c using(category_id)
    //         where ohp.order_id = $1 and o.user_id = $2
    // `,
    text: `
      select 
        ohp.order_id, o.date, o.status, SUM(ohp.qty * p.price) as order_total,
        json_agg(
          json_build_object(
            'product', p.*,
            'qty', ohp.qty,
            'total', ohp.qty * p.price
          )
        ) AS products
      from order_has_products ohp
      join orders o using(order_id)
      join products p using(product_id)
      where user_id = $1 and order_id = $2
      group by ohp.order_id, o.date, o.status;
    `,
    values: [user_id, order_id],
  };

  const result = await pool.query(query);
  return result.rows?.length ? result.rows[0] : null;
};

const getLatestOrder = async (user_id) => {
  let query = {
    text: `
      SELECT order_id FROM orders WHERE user_id = $1
      ORDER BY date DESC LIMIT 1
    `,
    values: [user_id],
  };

  const order = await pool.query(query);
  if (!order.rows?.length) {
    throw createError.InternalServerError("Unable to grab latest order.")
  }
  const order_id = order.rows[0].order_id;

  query = {
    text: `
      SELECT * FROM order_has_products 
      JOIN products p using(product_id)
      JOIN orders o using(order_id)
      WHERE order_id = $1
    `,
    values: [order_id]
  }
  const result = await pool.query(query);
  return result.rows?.length ? result.rows[0] : null;

}

const createOrder = async (data) => {
  // const { user_id, cart_id, date, status } = data;
  const { user_id, status, date, cart_id } = data;
  // console.log(result.rows)
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

    // Create a new order
    let query = {
      text: `INSERT INTO orders(user_id, date, status) values($1,$2,$3) RETURNING order_id`,
      values: [user_id, date, status]
    }


    const order = await client.query(query);
    if (!order.rows?.length) {
      // If the order wasn't returned, then something bad happened.
      // Don't continue with adding products to order_has_products table.
      throw createError.InternalServerError(
        "Unable to process order. Please try again."
      );
    }

    const order_id = order.rows[0].order_id;

    // Save the users products from the order
    query = {
      text: `INSERT INTO order_has_products(order_id, product_id, qty)
	SELECT o.order_id, chp.product_id, chp.qty
		FROM cart_has_products chp
		JOIN carts c using(cart_id)
		JOIN orders o using(user_id)
		where c.cart_id = $1 and o.order_id = $2 and user_id = $3 RETURNING *`,
      values: [cart_id, order_id, user_id],
    };

    await client.query(query);

    // Clear the users cart
    query = {
      text: `DELETE from cart_has_products WHERE cart_id = $1`,
      values: [cart_id]
    }
    await client.query(query);
    // Finally, commit all of these requests
    await client.query("COMMIT");

    return { order_id };
  } catch (err) {
    console.error(err);
    console.error(
      "An error occurred while creating order. Rolling back changes..."
    );
    // If an error occurred during one of these requests, our database will
    // not be in a good condition to restore customers orders. Rollback all 
    // requests and send an error to the client.
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

// const createOrder = async (data) => {
//   const { user_id, status, date } = data;
//   const query = {
//     text: `INSERT INTO orders(user_id, date, status) values($1,$2,$3) RETURNING order_id`,
//     values: [user_id, date, status]
//   }

//   const result = await pool.query(query);
//   console.log(result.rows)
//   return result.rows?.length ? result.rows[0] : null;
// }

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
  getLatestOrder,
  createOrder,
  updateOrderStatus,
};
