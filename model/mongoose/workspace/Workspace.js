/**
 * @module models/Workspace
 */

const mongoose = require('mongoose');
const { WORKSPACE_TYPE } = require('../../../constants/schemaConstants');

/**
 * Represents a Workspace.
 *
 * @typedef {Object} Workspace
 * @property {mongoose.Types.ObjectId} companyID - The ID of the associated company.
 * @property {string} workspaceName - The name of the workspace (maximum 200 characters).
 * @property {mongoose.Types.ObjectId} workspaceOwnerID - The ID of the workspace owner (a reference to the 'User' model).
 * @property {mongoose.Types.ObjectId} reportingID - The ID of the reporting user (a reference to the 'User' model).
 * @property {string} description - The description of the workspace (maximum 1000 characters).
 * @property {string} workspaceType - The type of the workspace, should be one of the constants from WORKSPACE_TYPE.
 * @property {mongoose.Types.ObjectId} createdBy - The ID of the user who created the workspace (a reference to the 'User' model).
 * @property {mongoose.Types.ObjectId} updatedBy - The ID of the user who last updated the workspace (a reference to the 'User' model).
 * @property {boolean} isActive - Indicates whether the workspace is active (default is true).
 * @property {boolean} isDeleted - Indicates whether the workspace is deleted (default is false).
 * @property {boolean} isFavourite - Indicates whether the workspace is marked as a favorite (default is false).
 * @property {Array<mongoose.Types.ObjectId>} membersID - An array of user IDs (references to the 'User' model) representing members of the workspace.
 * @property {string} colorCode - A string representing the color code of the workspace. It must be a valid hex color code (e.g., "#RRGGBB").
 * @property {Date} createdAt - The timestamp when the workspace was created (automatically managed by Mongoose).
 * @property {Date} updatedAt - The timestamp when the workspace was last updated (automatically managed by Mongoose).
 *
 * @class
 */
const WorkspaceSchema = new mongoose.Schema({
    workspaceName: {
        type: String,
        maxlength: 200,
        trim: true,
        required: true,
    },
    organizationID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization',
        required: true,
    },
    description: {
        type: String,
        trim: true,
        maxlength: 1000,
    },
    workspaceType: {
        type: String,
        enum: WORKSPACE_TYPE,
        default: WORKSPACE_TYPE[0],
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
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
    timestamps: true,
});

/**
 * @typedef Workspace
 */

WorkspaceSchema.set('toObject', { virtuals: true });
WorkspaceSchema.set('toJSON', { virtuals: true });

WorkspaceSchema.virtual('WorkspaceMember', {
    'ref': 'WorkspaceMember',
    localField: '_id',
    foreignField: 'workspaceID',
    options: {
        match: {
            isActive: true,
            isDeleted: false,
        },
        sort: { 'createdAt': -1 },
    },
});

/**
 * Mongoose model for the 'Workspace' collection.
 *
 * @type {mongoose.Model<Workspace>}
 */
const workspace = mongoose.model("Workspace", WorkspaceSchema);
workspace.syncIndexes();
module.exports = workspace;