/**
 * loginUser.js
 * @description :: middleware that verifies user's JWT token
 */

const jwt = require('jsonwebtoken');
const { PLATFORM } = require('../constants/authConstant');
const { JWT } = require('../constants/authConstant');

/**
 * @description : middleware for authenticate user with JWT token
 * @param {obj} req : request of route.
 * @param {obj} res : response of route.
 * @param {callback} next : executes the next middleware succeeding the current middleware.
 */
const authenticateJWT = (platform) => async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.unAuthorized();
    }
    const token = authHeader.split(' ')[1];
    let secret = JWT.WEB_SECRET;
    if (platform == PLATFORM.APP) {
        JWT.APP_SECRET
        secret = JWT.APP_SECRET;
    }
    jwt.verify(token, secret, (error, user) => {
        if (error) {
            if (error.name == "TokenExpiredError") {
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