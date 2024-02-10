const jwt = require('jsonwebtoken');

const authenticateUser = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) {
        return res.status(401).json({ message: "Authorization token is missing" });
    }

    try {
        const decoded = jwt.verify(token, 'your_secret_key');
        req.userId = decoded.userId;
        next();
    } catch (error) {
        res.status(403).json({ message: "Invalid token" });
    }
};

module.exports = authenticateUser;