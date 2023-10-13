/**
 * index.js
 * @description Main index route of all modules.
 */

const express = require('express');

/**
 * Express router for the main index route.
 * @type {express.Router}
 */
const router = express.Router();

/**
 * Include the routes for the authentication module.
 */
router.use(require('./authentication'));

module.exports = router;
