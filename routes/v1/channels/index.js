/**
 * index.js
 * @description Express routes for channels APIs.
 */

const express = require('express');

/**
 * Express router for the channels APIs.
 * @type {express.Router}
 */
const router = express.Router();

const { CUURENT_API_VERSION } = require('../../../constants/appConstants');

/**
 * Controller for handling channels operations.
 * @type {object}
 */
const channelController = require(`../../../controllers/${CUURENT_API_VERSION}/channels/channelController`);

/**
 * Middleware for user authentication and authorization.
 * @type {function}
 */
const { PLATFORM_ACCESS } = require('../../../constants/authConstant');

/**
 * Route for user channels.
 * @name POST /channels
 * @function
 * @param {string} platform - The platform for channels
 * @param {string} project - The project for channels.
 * @param {function} channelController.index - The controller method for owner login.
 */
router.post('/index',channelController.index);

module.exports = router;
