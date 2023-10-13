/**
 * checkRolePermission.js
 * @description :: middleware that checks access of APIs for logged-in user
 */

const model = require('../../model/mongoose');
const mongooseService = require('../../utils/mongooseService');
const { replaceAll } = require('../../utils/common');

/**
 * @description : middleware for authentication with role and permission.
 * @param {obj} req : request of route.
 * @param {obj} res : response of route.
 * @param {callback} next : executes the next middleware succeeding the current middleware.
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
      { attributes: ['roleId'] });//we using id so change attr 
    if (rolesOfUser && rolesOfUser.length) {
      rolesOfUser = [...new Set((rolesOfUser).map((item) => item.roleId))];
      const route = await mongooseService.findOne(model.Route, {
        routeName: replaceAll((req.route.path.toLowerCase()), '/', '_'),
        routeURI: req.route.path.toLowerCase(),
      });
      if (route) {
        const allowedRoute = await mongooseService.findAll(model.RouteRole, {
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
          return res.unAuthorized({ message: 'You are not having permission to access this route!' });
        }
      } else {
        return res.unAuthorized({ message: 'You are not having permission to access this route!' });
      }
    } else {
      next();
    }
  } catch (error) {
    return res.unAuthorized({ message: 'Something went wrong...' });
  }
};


module.exports = { checkRolePermission };