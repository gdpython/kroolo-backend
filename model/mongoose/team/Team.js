/**
 * @module models/Team
 */

const mongoose = require('mongoose');
const {
    PROJECT_STATUS,
    PROJECT_PRIORITY,
} = require('../../../constants/schemaConstants');

/**
 * Represents a Team.
 *
 * @typedef {Object} Team
 * @property {mongoose.Types.ObjectId} workspaceID - The ID of the workspace (a reference to the 'Workspace' model).
 * @property {string} teamName - The name of the team (maximum 200 characters).
 * @property {string} description - The description of the team (maximum 1000 characters).
 * @property {mongoose.Types.ObjectId} createdBy - The ID of the user who created the team (a reference to the 'User' model).
 * @property {mongoose.Types.ObjectId} updatedBy - The ID of the user who last updated the team (a reference to the 'User' model).
 * @property {boolean} isActive - Indicates whether the team is active (default is true).
 * @property {boolean} isDeleted - Indicates whether the team is deleted (default is false).
 * @property {boolean} isFavourite - Indicates whether the team is marked as a favorite (default is false).
 * @property {Array<mongoose.Types.ObjectId>} membersID - An array of user IDs (references to the 'User' model) representing members of the project.
 * @property {Date} createdAt - The timestamp when the team was created (automatically managed by Mongoose).
 * @property {Date} updatedAt - The timestamp when the team was last updated (automatically managed by Mongoose).
 *
 * @class
 */

const TeamSchema = new mongoose.Schema(
    {
        organizationID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Organization',
            required: true,
        },
        workspaceID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Workspace',
            required: true,
        },
        teamName: {
            type: String,
            maxlength: 200,
            index: true,
            trim: true,
        },
        description: {
            type: String,
            maxlength: 1000,
            index: true,
            trim: true,
        },
        isPrivate: {
            type: Boolean,
            default: false,
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

TeamSchema.set('toObject', { virtuals: true });
TeamSchema.set('toJSON', { virtuals: true });

TeamSchema.virtual('teamMembers', {
    ref: 'TeamMember',
    localField: '_id',
    foreignField: 'teamId',
    options: {
        match: {
            status: 'ACTIVE',
        },
        sort: { createdAt: -1 },
    },
});

/**
 * Mongoose model for the 'Team' collection.
 *
 * @type {mongoose.Model<Team>}
 */
const Team = mongoose.model('Team', TeamSchema);
Team.syncIndexes();
module.exports = Team;
