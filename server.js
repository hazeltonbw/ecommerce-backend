const app = require("./index");
const dotenv = require("dotenv").config({
  path: "../.env",
});

const { PORT } = require("./config");

app.get("/", (req, res, next) => {
  res.send("Main page! :)))))");
});

app.listen(PORT, () => {
  console.log(`Server listening on PORT ${PORT}`);
});
