const isAuth = (req, res, next) => {
  if (req.session.isAuth) {
    next();
  } else {
    return res.status(401).json({
      message: "Session expired, Please login again",
    });
  }
};

const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  res.status(401).send("Unauthorized");
};

module.exports = { isAuth, isAuthenticated };
