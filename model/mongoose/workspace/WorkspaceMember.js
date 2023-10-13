const mongoose = require('mongoose');

/**
 * WorkspaceMember Schema
 * @private
 */
const WorkspaceMemberSchema = new mongoose.Schema({
    workspaceID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Workspace',
        required: true,
    },
    workspaceRoleID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OrganizationMember',
        required: true,
    },
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
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
    timestamps: true,
    versionKey: false
});

/**
 * Mongoose model for the 'WorkspaceMember' collection.
 *
 * @type {mongoose.Model<WorkspaceMember>}
 */
const WorkspaceMember =  mongoose.model("WorkspaceMember", WorkspaceMemberSchema);
WorkspaceMember.syncIndexes();
module.exports =WorkspaceMember;