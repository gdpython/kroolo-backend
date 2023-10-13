var mongoose = require('mongoose');
const { INVITATION_STATUS } = require('../../../constants/schemaConstants');
/**
 * OrganizationMember Schema
 */
const date = new Date()
var OrganizationMemberSchema = new mongoose.Schema({
    organizationID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Organization",
        required: true
    },
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    reportingMannagerID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    roleID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role',
        required: true
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
        ref:"Workspace"
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
    },
},
    {
        timestamps: true
    }
);

module.exports = mongoose.model("OrganizationMember", OrganizationMemberSchema);