/**
 * index.js
 * @description Express routes for user APIs.
 */

const express = require('express');

/**
 * Express router for the user APIs.
 * @type {express.Router}
 */
const router = express.Router();

const { CUURENT_API_VERSION } = require('../../../constants/appConstants');

/**
 * Controller for handling user operations.
 * @type {object}
 */
const userController = require(`../../../controllers/${CUURENT_API_VERSION}/user/userController`);
/**
 * Route for user login.
 * @name POST /login
 * @function
 * @param {string} platform - The platform for user (e.g., "OWNER", "PROJECT").
 * @param {string} project - The project for user.
 * @param {function} userController.changePassword - The controller method for owner login.
 */
router.post('/change-password', userController.changePassword);


module.exports = router;
