/**
 * @file Middleware that checks authentication and authorization of users.
 * @module middleware/mongoose/authUser
 */

const passport = require('passport');
const { PLATFORM_ACCESS } = require('../../constants/authConstant');
const model = require('../../model/mongoose');
const mongooseService = require('../../utils/mongooseService');
const { checkRolePermission } = require('./checkRolePermission');

/**
 * Returns a callback function that verifies the required access for the user.
 *
 * @callback verifyCallback
 * @param {Object} req - The request object for the route.
 * @param {Function} resolve - The resolve callback for a successful method.
 * @param {Function} reject - The reject callback for an error.
 * @param {number} platform - The platform.
 */

/**
 * Authentication middleware for checking user authentication and authorization.
 *
 * @param {number} platform - The platform for which access is being checked.
 * @param {string} module - The module related to the route.
 * @returns {Function} Middleware function for authentication.
 */
const auth = (platform, module) => async (req, res, next) => {
  if (platform == PLATFORM_ACCESS.OWNER) {
    return new Promise((resolve, reject) => {
      passport.authenticate('client-rule', { session: false }, verifyCallback(req, resolve, reject, platform))(
        req,
        res,
        next
      );
    })
      .then(() => {
        checkRouteRolePermission(module)(req, res, next);
      })
      .catch((err) => {
        return res.unAuthorized();
      });
  } else if (platform == PLATFORM_ACCESS.SCHOOL_ADMIN) {
    // Handle other platforms if needed.
  }
};

module.exports = auth;
