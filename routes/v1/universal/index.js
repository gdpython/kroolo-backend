/**
 * index.js
 * @description Express routes for universal APIs.
 */

const express = require('express');

/**
 * Express router for the universal APIs that used in all system.
 * @type {express.Router}
 */
const router = express.Router();

const { CUURENT_API_VERSION } = require('../../../constants/appConstants');

/**
 * Controller for handling all operations logs,swagger.
 * @type {object}
 */
const swaggerController = require(`../../../controllers/${CUURENT_API_VERSION}/universal/SwaggerController`);

/**
 * Middleware for user authentication and authorization.
 * @type {function}
 */

/**
 * Route for user universal.
 * @name GET /swagger
 * @name USE /swagger
 * @function
 * @param {string} platform - The platform for universal
 * @param {string} project - The project for universal.
 * @param {function} swaggerController.index - The controller method for swagger ui setup.
 */
// router.use('/swagger', swaggerController.serveSwaggerUI);
// router.get('/swagger', swaggerController.setupSwaggerUI);

module.exports = router;
