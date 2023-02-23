const pool = require("../db");
const createError = require("http-errors");

const getCarts = async () => {
  const statement = "SELECT * FROM carts ORDER BY cart_id ASC";
  const result = await pool.query(statement);
  return result.rows;
};

const getCartById = async (id) => {
  const query = {
    text: `SELECT * FROM carts 
            join cart_has_products using(cart_id)
            WHERE cart_id = $1
    `,
    values: [id],
  };
  const result = await pool.query(query);
  if (result.rows?.length) {
    return result.rows[0];
  } else {
    return null;
  }
};

module.exports = {
  getCarts,
  getCartById,
};
