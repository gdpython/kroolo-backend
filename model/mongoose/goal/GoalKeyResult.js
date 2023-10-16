/**
 * @module models/GoalKeyResult
 */

const mongoose = require('mongoose');
const { GOAL_KEY_RESULT_MEASUREMENT_UNIT } = require('../../../constants/schemaConstants');

/**
 * Represents a GoalKeyResult.
 *
 * @typedef {Object} GoalKeyResult
 * @property {mongoose.Types.ObjectId} goalID - The ID of the goal (a reference to the 'Goal' model).
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

const GoalKeyResultSchema = new mongoose.Schema(
    {
        organizationID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Organization',
            required: true,
        },
        goalID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Goal',
            required: true,
        },
        keyName: {
            type: String,
            required: true,
        },
        description: {
            type: String,
        },
        startDate: {
            type: Date,
        },
        endDate: {
            type: Date,
        },
        completionDate: {
            type: Date,
        },
        measurementUnit: {
            type: String,
            enum: GOAL_KEY_RESULT_MEASUREMENT_UNIT,
        },
        customLabel: {
            type: String,
        },
        initialValue: {
            type: String,
        },
        targetValue: {
            type: String,
        },
        currentValue: {
            type: String,
        },
        keyProgress: {
            type: Number,
            default: 0,
        },
        members: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                default: null,
            },
        ],
        isOpen: {
            type: Boolean,
            default: true,
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

GoalKeyResultSchema.set('toObject', { virtuals: true });
GoalKeyResultSchema.set('toJSON', { virtuals: true });

/**
 * Mongoose model for the 'GoalKeyResult' collection.
 *
 * @type {mongoose.Model<GoalKeyResult>}
 */

const GoalKeyResult = mongoose.model('GoalKeyResult', GoalKeyResultSchema);
GoalKeyResult.syncIndexes();
module.exports = GoalKeyResult;
