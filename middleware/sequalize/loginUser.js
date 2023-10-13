/**
 * @file Middleware that verifies user's JWT token.
 * @module middleware/sequalize/loginUser
 */

const jwt = require('jsonwebtoken');
const { PLATFORM } = require('../constants/authConstant');
const { JWT } = require('../constants/authConstant');

/**
 * Middleware for authenticating the user with a JWT token.
 *
 * @param {number} platform - The platform type (e.g., PLATFORM.APP).
 * @returns {Function} Middleware function.
 *
 * @param {object} req - The request object of the route.
 * @param {object} res - The response object of the route.
 * @param {Function} next - Executes the next middleware succeeding the current middleware.
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
