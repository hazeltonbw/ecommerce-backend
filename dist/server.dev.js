"use strict";

var app = require("./index");

var dotenv = require("dotenv").config({
  path: "../.env"
});

var _require = require("./config"),
    PORT = _require.PORT;

app.get("/", function (req, res, next) {
  console.log(req.user, "req.user from root path");
  res.send(req);
});
app.listen(PORT, function () {
  console.log("Server listening on PORT ".concat(PORT));
});