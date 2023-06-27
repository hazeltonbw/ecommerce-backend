const isLoggedIn = async (req, res, next) => {
  console.log(req.isAuthenticated(), "is authenticated");
  console.log(req.user, "req.user");
  if (req.isAuthenticated() && req?.user != null) {
    return next();
  }

  // If the user still has a session attached
  if (req.session) {
    req.session.destroy();
  }
  // If the user is not logged in, 
  // redirect them to the login page.
  res.status(200).json({
    success: false,
    redirectUrl: "/auth/login",
    error: "Unauthenticated"
  });
};

const isAdmin = async (req, res, next) => {
  if (req.user?.is_admin) {
    return next();
  }
  res.status(200).json({
    success: false,
    redirectUrl: "/auth/login",
    error: "Unauthenticated"
  });
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
