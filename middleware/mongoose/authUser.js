/**
 * @file Middleware that checks authentication and authorization of users.
 * @module middleware/mongoose/authUser
 */

const passport = require('passport');
const { PLATFORM_ACCESS } = require('../../constants/authConstant');
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
const verifyCallback = (req, resolve, reject, platform) => async (err, user, info) => {
  try {
    if (err || info || !user) {
      return reject('Unauthorized User');
    }
    req.user = user;

    if (!user.isActive) {
      return reject('User is deactivated');
    }
    let userToken = await mongooseService.findOne(model.UserToken, {
      token: (req.headers.authorization).replace('Bearer ', ''),
      userId: user.id
    });
    if (!userToken) {
      return reject('Token not found');
    }
    if (userToken.isTokenExpired) {
      return reject('Token is Expired');
    }
    if (user.userRole) {
      let allowedRoles
      if (platform == PLATFORM_ACCESS.OWNER) {
        allowedRoles = user.roleName.split(",")
      }else if (platform == PLATFORM_ACCESS.OWNER) {
        allowedRoles = user.userRole
      }
      if (!allowedRoles.includes(platform)) {
        return reject('Unauthorized user');
      }
    }
    //here we can check role for particular permission
    checkRolePermission()
    resolve();
  } catch (error) {
    console.log('error', error.message)
    reject();
  }
};
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
        checkRolePermission(module)(req, res, next);
      })
      .catch((err) => {
        return res.unAuthorized();
      });
  }
};

module.exports = auth;
