const { DB } = require("../config");
const Pool = require("pg").Pool;
const pool = new Pool({
  user: DB.PGUSER,
  host: DB.PGHOST,
  database: DB.PGDATABASE,
  password: DB.PGPASSWORD,
  port: DB.PGPORT,
});

module.exports = {
  async query(text, params) {
    const start = Date.now();
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    if (process.env.NODE_ENV !== "test") {
      console.log("executed query", { text, duration, rows: res.rowCount });
    }
    return res;
  },
  pool: pool,
};
