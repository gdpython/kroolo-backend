/**
 * @file Mongoose model for Role.
 * @module model/mongoose/Role
 */

var mongoose = require('mongoose');

/**
 * Represents the schema for a Role document in MongoDB.
 *
 * @typedef {object} Role
 * @property {string} moduleName - The name of the module associated with the role.
 * @property {string} roleName - The name of the role.
 * @property {ObjectId} createdBy - The user who created the role (references the 'User' model).
 * @property {ObjectId} updatedBy - The user who last updated the role (references the 'User' model).
 * @property {boolean} isActive - Indicates if the role is active.
 * @property {boolean} isDeleted - Indicates if the role is deleted.
 * @property {Date} createdAt - The timestamp when the role was created (auto-generated).
 * @property {Date} updatedAt - The timestamp when the role was last updated (auto-generated).
 */

/**
 * Mongoose schema for the Role model.
 *
 * @type {mongoose.Schema}
 */
var RoleSchema = new mongoose.Schema({
    moduleName: {
        type: String,
        trim: true,
        default: ''
    },
    roleName: {
        type: String,
        trim: true,
        default: ''
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
 * Mongoose model for the 'Role' collection.
 *
 * @type {mongoose.Model<Role>}
 */
module.exports = mongoose.model("Role", RoleSchema);
