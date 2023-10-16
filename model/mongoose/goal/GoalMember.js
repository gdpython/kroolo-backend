/**
 * @module models/GoalMember
 */

const mongoose = require('mongoose');
const { INVITATION_STATUS } = require('../../../constants/schemaConstants');

/**
 * Represents a GoalMember.
 *
 * @typedef {Object} GoalMember
 * @property {mongoose.Types.ObjectId} organizationMemberID - The ID of the OrganizationMember (a reference to the 'OrganizationMember' model).
 * @property {mongoose.Types.ObjectId} workspaceID - The ID of the workspace (a reference to the 'Workspace' model).
 * @property {mongoose.Types.ObjectId} userID - The ID of the user (a reference to the 'User' model).
 * @property {mongoose.Types.ObjectId} roleID - The ID of the role (a reference to the 'Role' model).
 * @property {Boolean} isFavourite - Indicates whether the project is private/public (default is false).
 * @property {string} colorCode - The color code of the project.
 * @property {mongoose.Types.ObjectId} createdBy - The ID of the user who created the project (a reference to the 'User' model).
 * @property {mongoose.Types.ObjectId} updatedBy - The ID of the user who last updated the project (a reference to the 'User' model).
 * @property {boolean} isActive - Indicates whether the project is active (default is true).
 * @property {boolean} isDeleted - Indicates whether the project is deleted (default is false).
 * @property {Date} createdAt - The timestamp when the project was created (automatically managed by Mongoose).
 * @property {Date} updatedAt - The timestamp when the project was last updated (automatically managed by Mongoose).
 *
 * @class
 */
const GoalMemberSchema = new mongoose.Schema({
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
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    roleID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role',
    },
    isFavourite: {
        type: Boolean,
        default: false
    },
    colorCode: {
        type: String,
        validate: {
            validator: (value) => /^#(?:[0-9a-fA-F]{3}){1,2}$/.test(value),
            message: 'Invalid color hex code format.'
        }
    },
    inviteStatus: {
        type: String,
        enum: INVITATION_STATUS,
        default: INVITATION_STATUS[0]
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
 * Mongoose model for the 'GoalMember' collection.
 *
 * @type {mongoose.Model<GoalMember>}
 */
const GoalMember =  mongoose.model("GoalMember", GoalMemberSchema);
GoalMember.syncIndexes();
module.exports =GoalMember;