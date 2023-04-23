const isLoggedIn = async (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/auth/login");
};

const isAdmin = async (req, res, next) => {
  if (req.user?.is_admin) {
    return next();
  }
  res.status(401).send({ message: "Unauthorized" });
};

const isAlreadyLoggedIn = async (req, res) => {
  if (req.isAuthenticated()) {
    console.log("you're already logged in.. redirecting to root page");
    res.status(200).json({
      success: true,
      redirectUrl: "/",
    });
  } else {
    res.sendStatus(200);
  }
};

module.exports = {
  isLoggedIn,
  isAdmin,
  isAlreadyLoggedIn,
};
