/**
 * index.js
 * @description Main index route of all modules.
 */

const express = require('express');
const { CUURENT_API_VERSION, MODULE_ROUTES } = require('../../constants/appConstants');

/**
 * Express router for the main index route.
 * @type {express.Router}
 */
const router = express.Router();

/**
 * Include the routes for the authentication module.
 */
router.use(`/${CUURENT_API_VERSION}/${MODULE_ROUTES.USERS}` ,require('./authentication'));

module.exports = router;
