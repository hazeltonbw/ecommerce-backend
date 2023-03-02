const pool = require("../db");

const getCarts = async () => {
  const statement = `SELECT * FROM carts 
                      join cart_has_products using(cart_id) 
                     ORDER BY cart_id ASC`;
  const result = await pool.query(statement);
  return result.rows;
};

const getCartByUserId = async (user_id) => {
  const query = {
    text: `SELECT products.title product_title, products.price product_price,
            products.description product_description, categories.name category_name, 
            carts.created, carts.modified, cart_has_products.qty, 
            sum(cart_has_products.qty * products.price) as total
	         FROM carts 
            join cart_has_products using(cart_id)
			      join products using(product_id)
			      join categories using(category_id)
           WHERE user_id = $1
           GROUP BY 1,2,3,4,5,6,7;`,
    values: [user_id],
  };
  const result = await pool.query(query);
  return result.rows?.length ? result.rows : null;
};

const createCart = async (user_id) => {
  const date = new Date().toISOString();
  const query = {
    text: `INSERT INTO carts(user_id, created, modified)
              values($1, $2, $3) RETURNING *`,
    values: [user_id, date, date],
  };

  const result = await pool.query(query);
  return result.rows?.length ? result.rows[0] : null;
};

const addProductToCart = async (data) => {
  const { cart_id, product_id, qty } = data;
  const query = {
    text: `INSERT INTO cart_has_products(cart_id, product_id, qty) values($1, $2, $3) RETURNING *`,
    values: [cart_id, product_id, qty],
  };
  const result = await pool.query(query);
  return result.rows?.length ? result.rows[0] : null;
};

const getCartIdByUserId = async (user_id) => {
  const query = {
    text: `SELECT cart_id from carts where user_id = $1`,
    values: [user_id],
  };
  const result = await pool.query(query);
  return result.rows?.length ? result.rows[0].cart_id : null;
};

const resetCart = async (cart_id) => {
  const query = {
    text: `DELETE FROM cart_has_products WHERE cart_id = $1`,
    values: [cart_id],
  };
  const result = await pool.query(query);
  return result.rows?.length ? result.rows[0].cart_id : null;
};

const editProductInCart = async (data) => {
  const { product_id, cart_id, qty } = data;
  const query = {
    text: `UPDATE cart_has_products SET qty = $1 WHERE product_id = $2 and cart_id = $3`,
    values: [qty, product_id, cart_id],
  };
  const result = await pool.query(query);
  return result.rows?.length ? result.rows[0].cart_id : null;
};

const deleteProductInCart = async (data) => {
  const { product_id, cart_id } = data;
  const query = {
    text: `DELETE FROM cart_has_products WHERE product_id = $1 and cart_id = $2`,
    values: [product_id, cart_id],
  };
  const result = await pool.query(query);
  return result.rows?.length ? result.rows[0].cart_id : null;
};

const deleteAllProductsInCart = async (cart_id) => {
  const query = {
    text: `DELETE FROM cart_has_products WHERE cart_id = $1`,
    values: [cart_id],
  };

  const result = await pool.query(query);
  return result.rows?.length ? result.rows[0].cart_id : null;
};

const deleteUsersCart = async (cart_id) => {
  // First delete all references to the cart
  await deleteAllProductsInCart(cart_id);
  const query = {
    text: `DELETE FROM carts WHERE cart_id = $1`,
    values: [cart_id],
  };

  const result = await pool.query(query);
  return result.rows?.length ? result.rows[0].cart_id : null;
};

module.exports = {
  getCarts,
  getCartByUserId,
  createCart,
  addProductToCart,
  getCartIdByUserId,
  editProductInCart,
  deleteProductInCart,
  deleteUsersCart,
  resetCart,
};
