var mongoose = require('mongoose');
const { TASK_VIEW, COGNITO_STATUS } = require('../../../constants/schemaConstants');
/**
 * User Schema
 */
const date = new Date()
var UserSchema = new mongoose.Schema({
    fullName: {
        type: String,
        trim: true,
        default: ''
    },
    email: {
        type: String,
        trim: true,
        required: true,
        default: ''
    },
    username: {
        type: String,
        trim: true,
        required: true,
        default: this.email
    },
    mobile: {
        type: Number,
        default: ''
    },
    password: {
        type: String,
        trim: true,
        default: ''
    },
    dateOfBirth: {
        type: Date,
        trim: true,
        default: date
    },
    designation: {
        type: String,
        trim: true,
        default: ''
    },
    departmentID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department'
    },
    onBoardingStep: {
        type: Number,
        default: 1
    },
    verifyEmail: {
        type: Boolean,
        default: false
    },
    loginWithGoogle: {
        refID: {
            type: String,
            trim: true,
            default: ''
        },
        status: {
            type: Boolean,
            default: false
        }
    },
    invitedUser: {
        refID: {
            type: mongoose.Schema.Types.ObjectId,
            trim: true,
            default: ''
        },
        status: {
            type: Boolean,
            default: false
        }
    },
    profileImage: {
        type: String,
        trim: true,
        default: ''
    },
    taskView: {
        type: String,
        enum: TASK_VIEW,
        default: TASK_VIEW[0]
    },
    cogintoStatus:{
        type:String,
        enum:COGNITO_STATUS,
        default:COGNITO_STATUS[0]
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
    },
    currentLoginIP: {
        type: String,
        default: ""
    },
    lastLoginIP: {
        type: String,
        default: ""
    },
    countryID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Country"
    },

},
    {
        timestamps: true
    }
);

module.exports = mongoose.model("User", UserSchema);