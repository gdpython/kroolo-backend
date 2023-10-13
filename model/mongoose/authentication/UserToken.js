/**
 * @file Mongoose model for UserToken.
 * @module model/mongoose/UserToken
 */

var mongoose = require('mongoose');

/**
 * Represents the schema for a UserToken document in MongoDB.
 *
 * @typedef {object} UserToken
 * @property {ObjectId} userID - The ID of the user associated with this token (references the 'User' model).
 * @property {string} token - The user's token (required).
 * @property {Date} tokeExpiredTime - The timestamp when the token expires.
 * @property {boolean} isTokenExpired - Indicates if the token is expired.
 * @property {boolean} isActive - Indicates if the token is active.
 * @property {boolean} isDeleted - Indicates if the token is deleted.
 * @property {Date} createdAt - The timestamp when the UserToken document was created (auto-generated).
 * @property {Date} updatedAt - The timestamp when the UserToken document was last updated (auto-generated).
 */

/**
 * Mongoose schema for the UserToken model.
 *
 * @type {mongoose.Schema}
 */
const date = new Date();
var UserTokenSchema = new mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    token: {
        type: String,
        required: true,
        default: ''
    },
    cognitoTokeExpiredTime: {
        type: Date,
        default: date
    },
    jwtTokeExpiredTime: {
        type: Date,
        default: date
    },
    isTokenExpired: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
}, {
    timestamps: true
});

/**
 * Mongoose model for the 'UserToken' collection.
 *
 * @type {mongoose.Model<UserToken>}
 */
module.exports = mongoose.model("UserToken", UserTokenSchema);
