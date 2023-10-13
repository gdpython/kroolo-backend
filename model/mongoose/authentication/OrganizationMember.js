/**
 * @file Mongoose model for Organization Member.
 * @module model/mongoose/authentication/OrganizationMember
 */

var mongoose = require('mongoose');
const { INVITATION_STATUS } = require('../../../constants/schemaConstants');

/**
 * Represents the schema for an Organization Member document in MongoDB.
 *
 * @typedef {object} OrganizationMember
 * @property {ObjectId} organizationID - The ID of the organization to which the member belongs (references the 'Organization' model).
 * @property {ObjectId} userID - The ID of the user who is a member (references the 'User' model).
 * @property {ObjectId} reportingMannagerID - The ID of the reporting manager (references the 'User' model).
 * @property {ObjectId} roleID - The ID of the role of the member (references the 'Role' model).
 * @property {ObjectId} departmentID - The ID of the department to which the member belongs (references the 'Department' model).
 * @property {string} designation - The designation of the member.
 * @property {object} invitation - The invitation status of the member.
 * @property {string} invitation.status - The status of the invitation.
 * @property {Date} invitation.timestamps - The timestamp of the invitation (default to the current date).
 * @property {ObjectId[]} workspaceID - An array of workspace IDs (references the 'Workspace' model).
 * @property {ObjectId} createdBy - The user who created the organization member (references the 'User' model).
 * @property {ObjectId} updatedBy - The user who last updated the organization member (references the 'User' model).
 * @property {boolean} isActive - Indicates if the organization member is active.
 * @property {boolean} isDeleted - Indicates if the organization member is deleted.
 * @property {Date} createdAt - The timestamp when the organization member was created (auto-generated).
 * @property {Date} updatedAt - The timestamp when the organization member was last updated (auto-generated).
 */

/**
 * Mongoose schema for the Organization Member model.
 *
 * @type {mongoose.Schema}
 */
const date = new Date();
var OrganizationMemberSchema = new mongoose.Schema({
    organizationID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Organization",
        required: true
    },
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    reportingMannagerID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    roleID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role'
    },
    departmentID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department'
    },
    designation: {
        type: String,
        trim: true,
        default: ''
    },
    invitation: {
        status: {
            type: String,
            enum: INVITATION_STATUS,
            default: INVITATION_STATUS[0]
        },
        timestamps: {
            type: Date,
            default: date
        }
    },
    workspaceID: [{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Workspace"
    }],
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
 * Mongoose model for the 'OrganizationMember' collection.
 *
 * @type {mongoose.Model<OrganizationMember>}
 */
module.exports = mongoose.model("OrganizationMember", OrganizationMemberSchema);
