/**
 * @file Middleware that verifies user's JWT token.
 * @module middleware/loginuser
 */

const jwt = require('jsonwebtoken');
const { JWT, PLATFORM } = require('../../constants/authConstant');

/**
 * Middleware for authenticating users with JWT token.
 *
 * @param {int} platform - The platform for which the token is being authenticated (e.g., PLATFORM.WEB or PLATFORM.APP).
 * @returns {Function} Middleware function for JWT token authentication.
 */
const authenticateJWT = (platform) => async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.unAuthorized();
    }
    const token = authHeader.split(' ')[1];
    let secret = JWT.WEB_SECRET;
    if (platform === PLATFORM.APP) {
        secret = JWT.APP_SECRET;
    }
    jwt.verify(token, secret, (error, user) => {
        if (error) {
            if (error.name === "TokenExpiredError") {
                return res.unAuthorized({ message: 'Your Session Has Expired...' });
            } else {
                return res.unAuthorized();
            }
        }
        req.user = user;

        next();
    });
};

module.exports = authenticateJWT;
