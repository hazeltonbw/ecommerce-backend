const app = require("./index");
const dotenv = require("dotenv").config({
  path: "../.env",
});

const { PORT } = require("./config");

app.get("/", (req, res, next) => {
  console.log(req.session, "req.session from root path");
  console.log(req.passport, "req.passport from root path");
  console.log(req.user, "req.user from root path");
  console.log(req.session.passport, "req.session.passport from root path");
  console.log(typeof req.session);
  res.status(200).json(req.session);
});

app.listen(PORT, () => {
  console.log(`Server listening on PORT ${PORT}`);
});
