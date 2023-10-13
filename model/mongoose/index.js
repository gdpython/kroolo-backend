/**
 * @file Main index file for Mongoose models.
 * @module model/mongoose/index
 */

const User = require("./authentication/User");
const Department = require("./authentication/Department");
const Country = require("./authentication/Country");
const Organizations = require("./authentication/Organizations");
const OrganizationMember = require("./authentication/OrganizationMember");
const Role = require("./authentication/Role");
const Route = require("./authentication/Route");
const RouteRole = require("./authentication/RouteRole");
const UserToken = require("./authentication/UserToken");

/**
 * A module that exports all Mongoose models for authentication and related entities.
 *
 * @typedef {object} MongooseModels
 * @property {mongoose.Model<User>} User - Mongoose model for the User entity.
 * @property {mongoose.Model<Department>} Department - Mongoose model for the Department entity.
 * @property {mongoose.Model<Country>} Country - Mongoose model for the Country entity.
 * @property {mongoose.Model<Organizations>} Organizations - Mongoose model for the Organizations entity.
 * @property {mongoose.Model<OrganizationMember>} OrganizationMember - Mongoose model for the OrganizationMember entity.
 * @property {mongoose.Model<Role>} Role - Mongoose model for the Role entity.
 * @property {mongoose.Model<Route>} Route - Mongoose model for the Route entity.
 * @property {mongoose.Model<RouteRole>} RouteRole - Mongoose model for the RouteRole entity.
 * @property {mongoose.Model<UserToken>} UserToken - Mongoose model for the UserToken entity.
 */

/**
 * Exports an object containing all the Mongoose models for authentication and related entities.
 *
 * @type {MongooseModels}
 */
module.exports = {
    User,
    Department,
    Country,
    Organizations,
    OrganizationMember,
    Role,
    Route,
    RouteRole,
    UserToken
};
