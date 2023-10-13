/**
 * @file Mongoose model for RouteRole.
 * @module model/mongoose/RouteRole
 */

var mongoose = require('mongoose');

/**
 * Represents the schema for a RouteRole document in MongoDB.
 *
 * @typedef {object} RouteRole
 * @property {ObjectId} routeID - The ID of the route (references the 'Route' model).
 * @property {ObjectId} roleID - The ID of the role (references the 'Role' model).
 * @property {ObjectId} createdBy - The user who created the route-role association (references the 'User' model).
 * @property {ObjectId} updatedBy - The user who last updated the route-role association (references the 'User' model).
 * @property {boolean} isActive - Indicates if the route-role association is active.
 * @property {boolean} isDeleted - Indicates if the route-role association is deleted.
 * @property {Date} createdAt - The timestamp when the route-role association was created (auto-generated).
 * @property {Date} updatedAt - The timestamp when the route-role association was last updated (auto-generated).
 */

/**
 * Mongoose schema for the RouteRole model.
 *
 * @type {mongoose.Schema}
 */
var RouteRoleSchema = new mongoose.Schema({
    routeID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Route'
    },
    roleID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role'
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

/**
 * Mongoose model for the 'RouteRole' collection.
 *
 * @type {mongoose.Model<RouteRole>}
 */
module.exports = mongoose.model("RouteRole", RouteRoleSchema);
