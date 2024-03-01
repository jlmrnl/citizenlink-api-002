const jwt = require('jsonwebtoken');

const extractUserIdFromToken = (req, res, next) => {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
  if (token) {
    jwt.verify(token, process.env.SECRET, (err, decodedToken) => {
      if (err || !decodedToken || !decodedToken.userId || !decodedToken.name) { // Check if decodedToken, userId, or name is undefined
        return res.status(401).json({ message: 'Invalid token' });
      } else {
        req.userId = decodedToken.userId; // Correctly access userId from decoded token
        req.name = decodedToken.name;
        next();
      }
    });
  } else {
    return res.status(401).json({ message: 'Token not provided' });
  }
};

module.exports = extractUserIdFromToken;
