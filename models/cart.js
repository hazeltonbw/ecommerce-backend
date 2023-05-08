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
    text: `
      SELECT products.product_id product_id, products.title title, products.price price, products."imgURL" img,
      products.description description, categories.name category, 
      cart_has_products.qty, 
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
  //console.log(result.rows);
  return result.rows.length ? result.rows : null;
};

const createCart = async (user_id) => {
  const query = {
    text: `INSERT INTO carts(user_id, created, modified)
              values($1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) 
              RETURNING *`,
    values: [user_id],
  };

  const result = await pool.query(query);
  return result.rows?.length ? result.rows[0] : null;
};

const addProductToCart = async (data) => {
  const { cart_id, product_id, qty } = data;

  // If the user adds the same product twice, just update the quantity!
  const query = {
    text: `
    WITH modified_date AS (
      UPDATE carts SET modified = CURRENT_TIMESTAMP
      WHERE cart_id = $1
      RETURNING modified
    )
    INSERT INTO cart_has_products (cart_id, product_id, qty) 
      values($1, $2, $3) 
    ON CONFLICT(cart_id, product_id) 
      DO UPDATE SET qty = 
        (select qty from cart_has_products where cart_id = $1 and product_id = $2) + $3;
    `,
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
    text: `
    WITH modified_date AS (
      UPDATE carts SET modified = CURRENT_TIMESTAMP
      WHERE cart_id = $1
      RETURNING modified
    )
    DELETE FROM cart_has_products WHERE cart_id = $1`,
    values: [cart_id],
  };
  const result = await pool.query(query);
  return result.rows?.length ? result.rows[0].cart_id : null;
};

const editProductInCart = async (data) => {
  const { product_id, cart_id, qty } = data;
  const query = {
    text: `
    WITH modified_date AS (
      UPDATE carts SET modified = CURRENT_TIMESTAMP
      WHERE cart_id = $3
      RETURNING modified
    )
    UPDATE cart_has_products SET qty = $1 WHERE product_id = $2 and cart_id = $3`,
    values: [qty, product_id, cart_id],
  };
  const result = await pool.query(query);
  return result.rows?.length ? result.rows[0].cart_id : null;
};

const deleteProductInCart = async (data) => {
  const { product_id, cart_id } = data;
  const query = {
    text: `
    WITH modified_date AS (
      UPDATE carts SET modified = CURRENT_TIMESTAMP
      WHERE cart_id = $2
      RETURNING modified
    )
    DELETE FROM cart_has_products WHERE product_id = $1 and cart_id = $2`,
    values: [product_id, cart_id],
  };
  const result = await pool.query(query);
  return result.rows?.length ? result.rows[0].cart_id : null;
};

const deleteAllProductsInCart = async (cart_id) => {
  const query = {
    text: `
    WITH modified_date AS (
      UPDATE carts SET modified = CURRENT_TIMESTAMP
      WHERE cart_id = $1
      RETURNING modified
    )
    DELETE FROM cart_has_products WHERE cart_id = $1`,
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
