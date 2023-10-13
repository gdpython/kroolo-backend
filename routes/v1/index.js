/**
 * Main entry point for the API routes.
 * @module index
 */

const express = require('express');
const { MODULE_NAME, CUURENT_API_VERSION, MODULE_ROUTES } = require('../../constants/appConstants');

const authenticationRoutes = require('./authentication');
const channelsRoutes = require('./channels');


/**
 * Express router for the main index route.
 * @type {express.Router}
 */
const router = express.Router();

/**
 * Middleware to set the module name and include authentication routes.
 * @function
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {function} next - The next middleware function.
 */
router.use(`/${CUURENT_API_VERSION}/${MODULE_ROUTES.USERS}` ,(req, res, next) => {
  /**
   * The module name for authentication.
   * @type {string}
   */
  req.modulename = MODULE_NAME.AUTHENTICATION;

  // Call the next middleware to authentication route
  next();
}, authenticationRoutes);

/**
 * Middleware to set the module name and include authentication routes.
 * @function
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {function} next - The next middleware function.
 */
router.use(`/${CUURENT_API_VERSION}/${MODULE_ROUTES.CHANNELS}` ,(req, res, next) => {
  /**
   * The module name for authentication.
   * @type {string}
   */
  req.modulename = MODULE_NAME.CHANNELS;

  // Call the next middleware to authentication route
  next();
}, channelsRoutes);

module.exports = router;
