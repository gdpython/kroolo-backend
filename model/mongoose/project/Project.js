/**
 * @module models/Project
 */

const mongoose = require('mongoose');
const {
    PROJECT_STATUS,
    PROJECT_PRIORITY,
} = require('../../../constants/schemaConstants');

/**
 * Represents a Project.
 *
 * @typedef {Object} Project
 * @property {mongoose.Types.ObjectId} workspaceID - The ID of the workspace (a reference to the 'Workspace' model).
 * @property {string} projectName - The name of the project (maximum 200 characters).
 * @property {string} description - The description of the project (maximum 1000 characters).
 * @property {string} projectType - The type of the project, should be one of the constants from PROJECT_TYPE.
 * @property {string} isPrivate - Indicates whether the project is private/public (default is false).
 * @property {Date} startDate - The start date of the project.
 * @property {Date} endDate - The end date of the project.
 * @property {string} projectKey - The key of the project.
 * @property {number} taskProgress - The progress of the project.
 * @property {string} projectStatus - The status of the project, should be one of the constants from PROJECT_STATUS.
 * @property {string} projectPriority - The priority of the project, should be one of the constants from PROJECT_PRIORITY.
 * @property {mongoose.Types.ObjectId} createdBy - The ID of the user who created the project (a reference to the 'User' model).
 * @property {mongoose.Types.ObjectId} updatedBy - The ID of the user who last updated the project (a reference to the 'User' model).
 * @property {boolean} isActive - Indicates whether the project is active (default is true).
 * @property {boolean} isDeleted - Indicates whether the project is deleted (default is false).
 * @property {boolean} isFavourite - Indicates whether the project is marked as a favorite (default is false).
 * @property {Array<mongoose.Types.ObjectId>} membersID - An array of user IDs (references to the 'User' model) representing members of the project.
 * @property {Date} createdAt - The timestamp when the project was created (automatically managed by Mongoose).
 * @property {Date} updatedAt - The timestamp when the project was last updated (automatically managed by Mongoose).
 *
 * @class
 */
const ProjectSchema = new mongoose.Schema(
    {
        workspaceID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Workspace',
            required: true,
        },
        projectName: {
            type: String,
            maxlength: 1000,
            trim: true,
            required: true,
        },
        description: {
            type: String,
            trim: true,
            maxlength: 2000,
        },
        isPrivate: {
            type: Boolean,
            default: false,
        },
        startDate: {
            type: Date,
        },
        endDate: {
            type: Date,
        },
        projectKey: {
            type: String,
            trim: true,
        },
        taskProgress: {
            type: Number,
            default: 0,
        },
        projectStatus: {
            type: String,
            enum: PROJECT_STATUS,
        },
        projectPriority: {
            type: String,
            enum: PROJECT_PRIORITY,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    },
);

/**
 * @typedef Project
 */

ProjectSchema.set('toObject', { virtuals: true });
ProjectSchema.set('toJSON', { virtuals: true });

ProjectSchema.virtual('projectMembers', {
    ref: 'ProjectMember',
    localField: '_id',
    foreignField: 'projectID',
    options: {
        match: {
            isActive: true,
            isDeleted: false,
        },
        sort: { createdAt: -1 },
    },
});

/**
 * Mongoose model for the 'Project' collection.
 *
 * @type {mongoose.Model<Project>}
 */
const project = mongoose.model('Project', ProjectSchema);
project.syncIndexes();
module.exports = project;
