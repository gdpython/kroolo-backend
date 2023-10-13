/**
 * @file Middleware that checks access of APIs for logged-in users.
 * @module middleware/checkrolepermission
 */

const model = require('../../model/mongoose');
const mongooseService = require('../../utils/mongooseService');
const { replaceAll } = require('../../utils/common');

/**
 * Middleware for authentication with role and permission.
 *
 * @param {Object} mod - The module related to the route.
 * @returns {Function} Middleware function for role and permission checking.
 */
const checkRolePermission = (mod) => async (req, res, next) => {
  try {
    if (!req.user) {
      return res.unAuthorized({ message: 'Authorization token required!' });
    }
    const loggedInUserId = req.user._id;
    let rolesOfUser = await mongooseService.findAll(model.adminUserRoles, {
      userId: loggedInUserId,
      isActive: true,
      isDeleted: false,
    },
    { attributes: ['roleId'] });
    if (rolesOfUser && rolesOfUser.length) {
      rolesOfUser = [...new Set(rolesOfUser.map(item => item.roleId))];
      const route = await mongooseService.findOne(model.projectRoute, {
        route_name: replaceAll(req.route.path.toLowerCase(), '/', '_'),
        uri: req.route.path.toLowerCase(),
      });
      if (route) {
        const allowedRoute = await mongooseService.findAll(model.routeRole, {
          $and: [
            { routeId: route.id },
            { roleId: { $in: rolesOfUser } },
            { isActive: true },
            { isDeleted: false },
          ],
        });
        if (allowedRoute && allowedRoute.length) {
          next();
        } else {
          return res.unAuthorized({ message: 'You do not have permission to access this route!' });
        }
      } else {
        return res.unAuthorized({ message: 'You do not have permission to access this route!' });
      }
    } else {
      next();
    }
  } catch (error) {
    return res.unAuthorized({ message: 'Something went wrong...' });
  }
};

module.exports = { checkRolePermission };
