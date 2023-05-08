const app = require("./index");
const dotenv = require("dotenv").config({
  path: "../.env",
});

const { PORT } = require("./config");

app.get("/", (req, res, next) => {
  // console.log("Root route".red);
  // console.log("req.session".red);
  // console.log(req.session);
  if (req.user) {
    res.status(200).json(req.user);
  } else {
    res.status(200).json("The root says you're not logged in! :)");
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on PORT ${PORT}`);
});
