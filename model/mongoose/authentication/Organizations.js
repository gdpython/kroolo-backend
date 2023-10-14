/**
 * @file Mongoose model for Organization.
 * @module model/mongoose/organization/Organization
 */

var mongoose = require('mongoose');

/**
 * Represents the schema for an Organization document in MongoDB.
 *
 * @typedef {object} Organization
 * @property {string} organizationName - The name of the organization.
 * @property {ObjectId} createdBy - The user who created the organization (references the 'User' model).
 * @property {ObjectId} updatedBy - The user who last updated the organization (references the 'User' model).
 * @property {boolean} isActive - Indicates if the organization is active.
 * @property {boolean} isDeleted - Indicates if the organization is deleted.
 * @property {Date} createdAt - The timestamp when the organization was created (auto-generated).
 * @property {Date} updatedAt - The timestamp when the organization was last updated (auto-generated).
 */

/**
 * Mongoose schema for the Organization model.
 *
 * @type {mongoose.Schema}
 */
var OrganizationSchema = new mongoose.Schema({
    organizationName: {
        type: String,
        trim: true,
        required: true,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
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
 * Mongoose model for the 'Organization' collection.
 *
 * @type {mongoose.Model<Organization>}
 */
module.exports = mongoose.model("Organization", OrganizationSchema);
