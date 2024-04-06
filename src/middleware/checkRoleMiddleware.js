const checkRole = (role) => {
  return (req, res, next) => {
    if (req.user.role === role) {
      next(); // User has the required role, allow access
    } else {
      return res
        .status(403)
        .json({
          error: "Forbidden",
          message: "You do not have permission to access this resource",
        });
    }
  };
};

module.exports = checkRole;
