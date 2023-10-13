const { DataTypes } = require('sequelize');
const { sequelize } = require('../../../config/dbConnection');
const bcrypt = require('bcrypt');

/**
 * Represents the Sequelize User model.
 *
 * @typedef {object} user
 * @property {string} _id - The unique ID of the user.
 * @property {string} fullName - The full name of the user.
 * @property {string} email - The email address of the user.
 * @property {string} username - The username of the user.
 * @property {number} mobile - The mobile number of the user.
 * @property {string} password - The hashed password of the user.
 * @property {Date} dateOfBirth - The date of birth of the user.
 * @property {string} designation - The designation of the user.
 * @property {string} departmentID - The ID of the department (references the 'Department' model).
 * @property {number} onBoardingStep - The onboarding step of the user.
 * @property {boolean} verifyEmail - Indicates if the user's email is verified.
 * @property {Object} loginWithGoogle - Google login information of the user.
 * @property {string} loginWithGoogle.refID - The reference ID for Google login.
 * @property {boolean} loginWithGoogle.status - Indicates the Google login status.
 * @property {Object} invitedUser - Information about invited users.
 * @property {string} invitedUser.refID - The reference ID for invited users.
 * @property {boolean} invitedUser.status - Indicates the invitation status.
 * @property {string} profileImage - The user's profile image URL.
 * @property {string} taskView - The user's task view type.
 * @property {string} cognitoStatus - The Cognito status of the user.
 * @property {string} createdBy - The ID of the user who created this user document (references the 'User' model).
 * @property {string} updatedBy - The ID of the user who last updated this user document (references the 'User' model).
 * @property {boolean} isActive - Indicates if the user is active.
 * @property {boolean} isDeleted - Indicates if the user is deleted.
 * @property {string} currentLoginIP - The user's current login IP address.
 * @property {string} lastLoginIP - The user's last login IP address.
 * @property {string} countryID - The ID of the country (references the 'Country' model).
 * @property {Date} createdAt - The timestamp when the user document was created (auto-generated).
 * @property {Date} updatedAt - The timestamp when the user document was last updated (auto-generated).
 */
let User = sequelize.define('User', {
    _id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    fullName: { type: DataTypes.STRING, defaultValue: '' },
    email: { type: DataTypes.STRING, defaultValue: '' },
    username: { type: DataTypes.STRING, defaultValue: '' },
    mobile: { type: DataTypes.INTEGER, defaultValue: '' },
    password: { type: DataTypes.STRING, defaultValue: '' },
    dateOfBirth: { type: DataTypes.DATE, defaultValue: new Date() },
    designation: { type: DataTypes.STRING, defaultValue: '' },
    departmentID: { type: DataTypes.UUID, defaultValue: null },
    onBoardingStep: { type: DataTypes.INTEGER, defaultValue: 1 },
    verifyEmail: { type: DataTypes.BOOLEAN, defaultValue: false },
    loginWithGoogle: {
        type: DataTypes.JSON,
        defaultValue: {},
    },
    invitedUser: {
        type: DataTypes.JSON,
        defaultValue: {},
    },
    profileImage: { type: DataTypes.STRING, defaultValue: '' },
    taskView: { type: DataTypes.STRING, defaultValue: 'default' },
    cognitoStatus: { type: DataTypes.STRING, defaultValue: 'default' },
    createdBy: { type: DataTypes.UUID, defaultValue: null },
    updatedBy: { type: DataTypes.UUID, defaultValue: null },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
    isDeleted: { type: DataTypes.BOOLEAN, defaultValue: false },
    currentLoginIP: { type: DataTypes.STRING, defaultValue: '' },
    lastLoginIP: { type: DataTypes.STRING, defaultValue: '' },
    countryID: { type: DataTypes.UUID, defaultValue: null },
}, {
    hooks: {
        beforeCreate: async function (user, options) {
            if (user.password) {
                user.password = await bcrypt.hash(user.password, 8);
            }
            user.isActive = true;
            user.isDeleted = false;
        },
        beforeBulkCreate: async function (users, options) {
            if (users !== undefined && users.length) {
                for (let index = 0; index < users.length; index++) {
                    const user = users[index];
                    if (user.password) {
                        user.password = await bcrypt.hash(user.password, 8);
                    }
                    user.isActive = true;
                    user.isDeleted = false;
                }
            }
        },
        afterCreate: async function (user, options) {
            sequelize.model('UserAuthSettings').create({ userId: user._id });
        },
    },
});

User.prototype.isPasswordMatch = async function (password) {
    return bcrypt.compare(password, this.password);
};

User.prototype.toJSON = function () {
    const values = Object.assign({}, this.get());
    delete values.password;
    return values;
};

module.exports = User;
