/**
 * index.js
 * @description Exports all the models and their relationships among other models.
 */

/**
 * Represents the database object containing all models and their relationships.
 * @typedef {object} Database
 * @property {sequelize} sequelize - The Sequelize database connection.
 * @property {Model} user - The User model.
 * // Define other model properties here...
 */

/**
 * Sequelize database connection.
 * @typedef {object} sequelize
 */

/**
 * Sequelize model for the User.
 * @typedef {sequelize.Model<User>} Model
 */

/**
 * Sequelize model for the User.
 * @typedef {object} User
 * @property {string} _id - The unique ID of the user.
 * @property {string} fullName - The full name of the user.
 * @property {string} email - The email address of the user.
 * // Include other user properties here...
 */

// Define other model typedefs and properties as needed...

const { sequelize: dbConnection } = require('../../config/dbConnection');
const db = {};
db.sequelize = dbConnection;

db.user = require('./authentication/User');

// Define model relationships and associations here...

module.exports = db;
