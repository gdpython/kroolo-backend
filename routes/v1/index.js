/**
 * Main entry point for the API routes.
 * @module index
 */

const express = require('express');
const { MODULE_NAME, CUURENT_API_VERSION, MODULE_ROUTES } = require('../../constants/appConstants');

const authenticationRoutes = require('./authentication');
const channelsRoutes = require('./channels');
const onboardingRoutes = require('./onboarding');
const { PLATFORM } = require('../../constants/authConstant');

/**
 * Middleware for onboarding user authentication and authorization.
 * @type {function}
 */
const validateOnboardingUser = require("../../middleware/mongoose/onboardingUser")

/**
 * Express router for the main index route.
 * @type {express.Router}
 */
const router = express.Router();

/**
 * Middleware to set the module name and include routes.
 * @function
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {function} next - The next middleware function.
 */
router.use(`/${CUURENT_API_VERSION}/${MODULE_ROUTES.USERS}`, (req, res, next) => {
  /**
   * The module name for authentication.
   * @type {string}
   */
  req.moduleName = MODULE_NAME.AUTHENTICATION;

  // Call the next middleware to authentication route
  next();
}, authenticationRoutes);

router.use(`/${CUURENT_API_VERSION}/${MODULE_ROUTES.CHANNELS}`, (req, res, next) => {
  /**
   * The module name for channels.
   * @type {string}
   */
  req.moduleName = MODULE_NAME.CHANNELS;

  // Call the next middleware to channels route
  next();
}, channelsRoutes);

router.use(`/${CUURENT_API_VERSION}/${MODULE_ROUTES.ONBOARDING}`, validateOnboardingUser(PLATFORM.WEB), (req, res, next) => {
  /**
   * The module name for onboarding.
   * @type {string}
   */
  req.moduleName = MODULE_NAME.ONBOARDING;

  // Call the next middleware to authentication route
  next();
}, onboardingRoutes);

module.exports = router;
