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
    organizationMemberID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OrganizationMember',
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
WorkspaceMember.syncIndexes();
module.exports = mongoose.model("WorkspaceMember", WorkspaceMemberSchema);