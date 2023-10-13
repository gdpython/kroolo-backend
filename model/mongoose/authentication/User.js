/**
 * @file Mongoose model for User.
 * @module model/mongoose/User
 */

var mongoose = require('mongoose');
const { TASK_VIEW, COGNITO_STATUS } = require('../../../constants/schemaConstants');
/**
 * Represents the schema for a User document in MongoDB.
 *
 * @typedef {object} User
 * @property {string} fullName - The full name of the user.
 * @property {string} email - The email address of the user.
 * @property {string} username - The username of the user (default is the email).
 * @property {number} mobile - The mobile number of the user.
 * @property {string} password - The password of the user.
 * @property {Date} dateOfBirth - The date of birth of the user.
 * @property {string} designation - The designation of the user.
 * @property {ObjectId} departmentID - The ID of the department (references the 'Department' model).
 * @property {number} onBoardingStep - The onboarding step of the user.
 * @property {boolean} verifyEmail - Indicates if the user's email is verified.
 * @property {Object} loginWithGoogle - Google login information of the user.
 * @property {Object} invitedUser - Information about invited users.
 * @property {string} profileImage - The user's profile image URL.
 * @property {string} taskView - The user's task view type.
 * @property {string} cognitoStatus - The Cognito status of the user.
 * @property {ObjectId} createdBy - The user who created this user document (references the 'User' model).
 * @property {ObjectId} updatedBy - The user who last updated this user document (references the 'User' model).
 * @property {boolean} isActive - Indicates if the user is active.
 * @property {boolean} isDeleted - Indicates if the user is deleted.
 * @property {string} currentLoginIP - The user's current login IP address.
 * @property {string} lastLoginIP - The user's last login IP address.
 * @property {ObjectId} countryID - The ID of the country (references the 'Country' model).
 * @property {Date} createdAt - The timestamp when the user document was created (auto-generated).
 * @property {Date} updatedAt - The timestamp when the user document was last updated (auto-generated).
 */

/**
 * Mongoose schema for the User model.
 *
 * @type {mongoose.Schema}
 */
const date = new Date();
var UserSchema = new mongoose.Schema({
    fullName: {
        type: String,
        trim: true,
        default: ''
    },
    email: {
        type: String,
        trim: true,
        default: ''
    },
    username: {
        type: String,
        trim: true,
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
    cogintoStatus: {
        type: String,
        enum: COGNITO_STATUS,
        default: COGNITO_STATUS[0]
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
        default: ''
    },
    lastLoginIP: {
        type: String,
        default: ''
    },
    countryID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Country"
    },
}, {
    timestamps: true
});

/**
 * Mongoose model for the 'User' collection.
 *
 * @type {mongoose.Model<User>}
 */
module.exports = mongoose.model("User", UserSchema);
