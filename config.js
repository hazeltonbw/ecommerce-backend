/*
@hazeltonbw When running `npm run create-db` there are no enviornment variables.
By using the npm package `dotenv` we can use the .env file at root. You may not want to do it this way,
but either way the npm script doesn't seem to be picking up the .env in root.
*/
require("dotenv").config();
module.exports = {
  PORT: process.env.PORT,
  DB: {
    PGHOST: process.env.PGHOST,
    PGUSER: process.env.PGUSER,
    PGDATABASE: process.env.PGDATABASE,
    PGPASSWORD: process.env.PGPASSWORD,
    PGPORT: process.env.PGPORT,
  },
  SESSION_SECRET: process.env.SESSION_SECRET,
};
