/**
 * @file Middleware that checks access of APIs for logged-in user using Sequelize.
 * @module middleware/sequalize/checkRolePermission
 */

const model = require('../model/sequalize');
const sqlService = require('../utils/sqlService');
const { replaceAll } = require('../utils/common');

/**
 * Middleware for authentication with role and permission.
 *
 * @param {object} req - The request object of the route.
 * @param {object} res - The response object of the route.
 * @param {Function} next - Executes the next middleware succeeding the current middleware.
 */
const checkRolePermission = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.unAuthorized({ message: 'Authorization token required!' });
    }
    const loggedInUserId = req.user.id;
    let rolesOfUser = await sqlService.findAll(model.adminUserRoles, {
      userId: loggedInUserId,
      isActive: true,
      isDeleted: false,
    },
      { attributes: ['roleId'] });
    if (rolesOfUser && rolesOfUser.length) {
      rolesOfUser = [...new Set(rolesOfUser.map((item) => item.roleId))];
      const route = await sqlService.findOne(model.projectRoute, {
        route_name: replaceAll(req.route.path.toLowerCase(), '/', '_'),
        uri: req.route.path.toLowerCase(),
      });
      if (route) {
        const allowedRoute = await sqlService.findAll(model.routeRole, {
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
