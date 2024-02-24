const jwt = require('jsonwebtoken');

const authenticateUser = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: "Unauthorized", message: "Authorization token is missing or invalid" });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: "Unauthorized", message: "Token has expired" });
    } else if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: "Unauthorized", message: "Invalid token" });
    } else {
      return res.status(500).json({ error: "Internal Server Error", message: "Something went wrong" });
    }
  }
};

module.exports = authenticateUser;