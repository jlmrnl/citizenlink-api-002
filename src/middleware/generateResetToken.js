const jwt = require('jsonwebtoken');

// Function to generate a JWT reset token
function generateResetToken(userId) {
    const secretKey = process.env.RESET_PASSWORD_SECRET;
    const expiresIn = '1h';
    const payload = {
        userId: userId,
    };
    const token = jwt.sign(payload, secretKey, { expiresIn });

    return token;
}

module.exports = generateResetToken;
