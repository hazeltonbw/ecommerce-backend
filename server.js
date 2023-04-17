const app = require("./index");
const dotenv = require("dotenv").config({
  path: "../.env",
});

const { PORT } = require("./config");

app.get("/", (req, res, next) => {
  console.log("Root route".red);
  console.log(req.user);
  res.send(req.user);
});

app.listen(PORT, () => {
  console.log(`Server listening on PORT ${PORT}`);
});
