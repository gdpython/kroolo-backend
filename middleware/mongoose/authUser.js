/**
 * auth.js
 * @description :: middleware that checks authentication and authorization of user
 */

const passport = require('passport');
const { PLATFORM_ACCESS } = require('../../constants/authConstant');
const model = require('../../model/mongoose');
const mongooseService = require('../../utils/mongooseService');
const { checkRolePermission } = require('./checkRolePermission');

/**
 * @description : returns callback that verifies required access
 * @param {obj} req : request of route.
 * @param {callback} resolve : resolve callback for succeeding method.
 * @param {callback} reject : reject callback for error.
 * @param {int} platform : platform.
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
 * @description : authentication middleware for request.
 * @param {obj} req : request of route.
 * @param {obj} res : response of route.
 * @param {callback} next : executes the next middleware succeeding the current middleware.
 * @param {int} platform : platform.
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
    //
  }
};

module.exports = auth;