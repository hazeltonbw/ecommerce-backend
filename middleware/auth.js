const isLoggedIn = async (req, res, next) => {
  //console.log("isLoggedIn middleware");
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/auth/login");
};

const isAdmin = async (req, res, next) => {
  if (req.user.is_admin) {
    return next();
  }
  res.status(401).send({ message: "Unauthorized" });
};

module.exports = {
  isLoggedIn,
  isAdmin,
};
