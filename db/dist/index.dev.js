"use strict";

var _require = require("../config"),
    DB = _require.DB;

var Pool = require("pg").Pool;

var pool = new Pool({
  user: DB.PGUSER,
  host: DB.PGHOST,
  database: DB.PGDATABASE,
  password: DB.PGPASSWORD,
  port: DB.PGPORT
});
module.exports = {
  query: function query(text, params) {
    var start, res, duration;
    return regeneratorRuntime.async(function query$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            start = Date.now();
            _context.next = 3;
            return regeneratorRuntime.awrap(pool.query(text, params));

          case 3:
            res = _context.sent;
            duration = Date.now() - start;

            if (process.env.NODE_ENV !== "test") {
              console.log("executed query", {
                text: text,
                duration: duration,
                rows: res.rowCount
              });
            }

            return _context.abrupt("return", res);

          case 7:
          case "end":
            return _context.stop();
        }
      }
    });
  },
  getClient: function getClient() {
    var client, query, release, timeout;
    return regeneratorRuntime.async(function getClient$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return regeneratorRuntime.awrap(pool.connect());

          case 2:
            client = _context2.sent;
            query = client.query;
            release = client.release; // set a timeout of 5 seconds, after which we will log this client's last query

            timeout = setTimeout(function () {
              console.error("A client has been checked out for more than 5 seconds!");
              console.error("The last executed query on this client was: ".concat(client.lastQuery));
            }, 5000); // monkey patch the query method to keep track of the last query executed

            client.query = function () {
              for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
              }

              if (process.env.NODE_ENV !== "test") {
                console.log("executed query", args);
              }

              client.lastQuery = args;
              return query.apply(client, args);
            };

            client.release = function () {
              // clear our timeout
              clearTimeout(timeout); // set the methods back to their old un-monkey-patched version

              client.query = query;
              client.release = release;
              return release.apply(client);
            };

            return _context2.abrupt("return", client);

          case 9:
          case "end":
            return _context2.stop();
        }
      }
    });
  },
  pool: pool
};