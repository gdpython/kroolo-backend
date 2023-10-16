/**
 * @module models/Goal
 */

const mongoose = require('mongoose');
const {
    PROJECT_STATUS,
    PROJECT_PRIORITY,
    GOAL_STATUS,
    GOAL_COLLABORATOR_TYPE,
    GOAL_TYPE,
} = require('../../../constants/schemaConstants');

/**
 * Represents a Goal.
 *
 * @typedef {Object} Goal
 * @property {mongoose.Types.ObjectId} workspaceID - The ID of the workspace (a reference to the 'Workspace' model).
 * @property {string} goalName - The name of the goal (maximum 200 characters).
 * @property {string} description - The description of the goal (maximum 1000 characters).
 * @property {Date} startDate - The start date of the goal.
 * @property {Date} completionDate - The completion date of the goal.
 * @property {string} goalProgress - The progress of the goal.
 * @property {string} goalAllKeyResultProgress - The progress of the goal.
 * @property {string} goalStatus - The status of the goal, should be one of the constants from GOAL_STATUS.
 * @property {string} goalPriority - The priority of the goal, should be one of the constants from PROJECT_PRIORITY.
 * @property {string} goalType - The type of the goal, should be one of the constants from PROJECT_TYPE.
 * @property {string} type - The type of the goal, should be one of the constants from PROJECT_TYPE.
 * @property {mongoose.Types.ObjectId} createdBy - The ID of the user who created the goal (a reference to the 'User' model).
 * @property {mongoose.Types.ObjectId} updatedBy - The ID of the user who last updated the goal (a reference to the 'User' model).
 * @property {boolean} isActive - Indicates whether the goal is active (default is true).
 * @property {boolean} isDeleted - Indicates whether the goal is deleted (default is false).
 * @property {boolean} isFavourite - Indicates whether the goal is marked as a favorite (default is false).
 * @property {Array<mongoose.Types.ObjectId>} membersID - An array of user IDs (references to the 'User' model) representing members of the project.
 * @property {Date} createdAt - The timestamp when the goal was created (automatically managed by Mongoose).
 * @property {Date} updatedAt - The timestamp when the goal was last updated (automatically managed by Mongoose).
 *
 * @class
 */

const GoalSchema = new mongoose.Schema(
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
        parentID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Goal',
            default: null,
        },
        goalName: {
            type: String,
            required: true,
            index: true,
        },
        description: {
            type: String,
        },
        startDate: {
            type: Date,
        },
        completionDate: {
            type: Date,
        },
        teamId: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Team',
                default: null,
            },
        ],
        goalProgress: {
            type: Number,
            default: 0,
        },
        goalAllKeyResultProgress: {
            type: Number,
            default: 0,
        },
        isPrivate: {
            type: Boolean,
            default: false,
        },
        goalStatus: {
            type: String,
            enum: GOAL_STATUS,
        },
        goalPriority: {
            type: String,
            enum: PROJECT_PRIORITY,
        },
        collaboratorType: {
            type: String,
            enum: GOAL_COLLABORATOR_TYPE,
            default: GOAL_COLLABORATOR_TYPE[0],
        },
        goalType: {
            type: String,
            enum: GOAL_TYPE,
            default: GOAL_TYPE[0],
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

GoalSchema.set('toObject', { virtuals: true });
GoalSchema.set('toJSON', { virtuals: true });

GoalSchema.virtual('goalMemberList', {
    ref: 'GoalMember',
    localField: '_id',
    foreignField: 'goalID',
    options: {
        match: {
            status: 'ACTIVE',
        },
        sort: { createdAt: -1 },
    },
});

/**
 * Mongoose model for the 'Goal' collection.
 *
 * @type {mongoose.Model<Goal>}
 */
const Goal = mongoose.model('Goal', GoalSchema);
Goal.syncIndexes();
module.exports = Goal;
