/**
 * index.js
 * @description Express routes for authentication APIs.
 */

const express = require('express');

/**
 * Express router for the authentication APIs.
 * @type {express.Router}
 */
const router = express.Router();

const { CUURENT_API_VERSION } = require('../../../constants/appConstants');

/**
 * Controller for handling authentication operations.
 * @type {object}
 */
const authController = require(`../../../controllers/${CUURENT_API_VERSION}/authentication/authController`);

/**
 * Constants for platform access levels.
 * @type {object}
 */
const { PLATFORM_ACCESS } = require('../../../constants/authConstant');

/**
 * Middleware for user authentication and authorization.
 * @type {function}
 */
const auth = require('../../../middleware/mongoose/authUser');

/**
 * Route for user login.
 * @name POST /login
 * @function
 * @param {string} platform - The platform for authentication (e.g., "OWNER", "PROJECT").
 * @param {string} project - The project for authentication.
 * @param {function} authController.ownerLogin - The controller method for owner login.
 */
router.post('/login', auth(PLATFORM_ACCESS.OWNER, "PROJECT"), authController.ownerLogin);

module.exports = router;
