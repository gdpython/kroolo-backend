/**
 * @file Middleware that checks authentication and authorization of the user using Sequelize.
 * @module middleware/sequalize/authUser
 */

const passport = require('passport');
const { PLATFORM_ACCESS } = require('../constants/authConstant');
const model = require('../model/sequalize');
const sqlService = require('../utils/sqlService');
const { checkRolePermission } = require('./checkRolePermission');

/**
 * Returns a callback function for verifying required access.
 *
 * @callback VerifyCallback
 * @param {Error} err - An error object.
 * @param {object} user - The authenticated user object.
 * @param {object} info - Additional information.
 */

/**
 * Callback function for verifying required access.
 *
 * @typedef {function} VerifyCallback
 * @param {object} req - The request object of the route.
 * @param {VerifyCallback} resolve - Resolve callback for the succeeding method.
 * @param {VerifyCallback} reject - Reject callback for error.
 * @param {int} platform - The platform for which access is required.
 */

/**
 * Middleware for authentication and authorization of the user.
 *
 * @param {int} platform - The platform for which access is required (e.g., PLATFORM_ACCESS.OWNER or PLATFORM_ACCESS.SCHOOL_ADMIN).
 * @returns {Function} Middleware function for authentication and authorization.
 */
const auth = (platform) => async (req, res, next) => {
  if (platform === PLATFORM_ACCESS.OWNER) {
    return new Promise((resolve, reject) => {
      passport.authenticate('client-rule', { session: false }, verifyCallback(req, resolve, reject, platform))(
        req,
        res,
        next
      );
    })
      .then(() => {
        checkRouteRolePermission(req, res, next);
      })
      .catch((err) => {
        return res.unAuthorized();
      });
  } else if (platform === PLATFORM_ACCESS.SCHOOL_ADMIN) {
    //
  }
};

module.exports = auth;
