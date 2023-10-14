/**
 * @file Middleware that checks access of APIs for logged-in users.
 * @module middleware/checkrolepermission
 */

// Import necessary modules and dependencies.
const model = require('../../model/mongoose');
const mongooseService = require('../../utils/mongooseService');
const { replaceAll } = require('../../utils/common');
const { MODULE_NAME } = require('../../constants/appConstants');

/**
 * Middleware for authentication with role and permission.
 *
 * @param {Object} module - The module related to the route.
 * @returns {Function} Middleware function for role and permission checking.
 */
const getRequestModal = (module) => {
  switch (module) {
    case MODULE_NAME.WORKSPACE:
      return model.WorkspaceMember;
    case MODULE_NAME.CHANNELS:
      return model.ChannelMember;
    case MODULE_NAME.DOCS:
      return model.DocsMember;
    case MODULE_NAME.GOALS:
      return model.GoalsMember;
    case MODULE_NAME.PROJECTS:
      return model.ProjectMember;
    case MODULE_NAME.SETTING:
      return model.SettingMember;
    case MODULE_NAME.TEAMS:
      return model.TeamMember;
    default:
      return model.User;
  }
};

/**
 * Get module-specific IDs and data based on the module name.
 *
 * @param {Object} userData - User data object containing module-specific information.
 * @param {string} module - The name of the module.
 * @returns {Object} An object containing module-specific IDs and data.
 */
const getRequestModuleID = (userData, module) => {
  let moduleID = { _id: null };
  let loggedInUserID = userData._id;
  let organizationID = userData.organizationID;

  switch (module) {
    case MODULE_NAME.AUTHENTICATION:
      moduleID = { _id: userData._id };
      break;
    case MODULE_NAME.WORKSPACE:
      moduleID = { workspaceMemberID: userData.workspaceMemberID };
      break;
    case MODULE_NAME.CHANNELS:
      moduleID = { channelMemberID: userData.channelMemberID };
      break;
    case MODULE_NAME.DOCS:
      moduleID = { docsMemberID: userData.docsMemberID };
      break;
    case MODULE_NAME.GOALS:
      moduleID = { goalsMemberID: userData.goalsMemberID };
      break;
    case MODULE_NAME.PROJECTS:
      moduleID = { projectsMemberID: userData.projectsMemberID };
      break;
    case MODULE_NAME.SETTING:
      moduleID = { settingMemberID: userData.settingMemberID };
      break;
    case MODULE_NAME.TEAMS:
      moduleID = { teamMemberID: userData.teamMemberID };
      break;
  }
  return { loggedInUserID, organizationID, moduleID };
};

/**
 * Middleware for checking user's role and permissions for a given route.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
const checkRolePermission = async (req, res, next) => {
  try {
    // Check if a user is authenticated.
    if (!req.user) {
      return res.unAuthorized({ message: 'Authorization token required!' });
    }

    // Get module-specific IDs and data based on the module name.
    const { moduleID, loggedInUserID, organizationID } = getRequestModuleID(req.moduleName, req.user);
    const ModuleModel = getRequestModal(req.moduleName);

    // Find roles of the user.
    let rolesOfUser = await mongooseService.findAll(ModuleModel, {
      organizationID,
      userID: loggedInUserID,
      isActive: true,
      isDeleted: false,
      ...moduleID
    }, { attributes: ['roleID'] });

    if (rolesOfUser && rolesOfUser.length) {
      // Extract unique role IDs.
      rolesOfUser = [...new Set(rolesOfUser.map((item) => item.roleID))];

      // Find the corresponding route.
      const route = await mongooseService.findOne(model.Route, {
        routeName: replaceAll(req.route.path.toLowerCase(), '/', '_'),
        routeURI: req.route.path.toLowerCase(),
      });

      if (route) {
        // Check if the user has permission for this route.
        const allowedRoute = await mongooseService.findAll(model.RouteRole, {
          $and: [
            { routeId: route.id },
            { roleId: { $in: rolesOfUser } },
            { isActive: true },
            { isDeleted: false },
          ],
        });

        if (allowedRoute && allowedRoute.length) {
          next(); // User has permission; continue to the route.
        } else {
          return res.unAuthorized({ message: 'You do not have permission to access this route!' });
        }
      } else {
        return res.unAuthorized({ message: 'You do not have permission to access this route!' });
      }
    } else {
      next(); // User has no associated roles; continue to the route.
    }
  } catch (error) {
    return res.unAuthorized({ message: 'Something went wrong...' });
  }
};

// Export the middleware function.
module.exports = { checkRolePermission };
