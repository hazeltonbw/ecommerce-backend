const expressLoader = require("./express");
const passportLoader = require("./passport");
const routeLoader = require("../routes");
//const swaggerLoader = require('./swagger');
//const swagger = require('./swagger');

module.exports = (app) => {
  // Load Express middlewares
  const expressApp = expressLoader(app);

  // Load Passport middleware
  const passport = passportLoader(expressApp);

  // Load API route handlers
  routeLoader(app, passport);

  // Load Swagger
  //await swaggerLoader(app);

  // Error Handler
  app.use((err, req, res, next) => {
    const { message } = err;
    const status = err.status || 500;

    return res.status(status).send({ message });
  });
};
