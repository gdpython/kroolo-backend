/**
 * Express server setup for running your web application.
 *
 * @file app.js
 * @requires express
 * @requires cors
 * @requires path
 * @requires dotenv
 * @requires passport
 * @requires @babel/register
 * @requires ./utils/sqlService
 * @requires ./utils/mongooseService
 * @requires ./constants/authConstant
 * @requires ./config/clientPassportStrategy
 * @requires ./config/dbInitialization
 *
 * @namespace
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: '.env' });
global.__basedir = __dirname;
const passport = require('passport');
require('@babel/register');
require('./utils/sqlService');
require('./utils/mongooseService');
const { TEST, DEV, PROD } = require("./constants/authConstant")

let logger = require('morgan');
const { clientPassportStrategy } = require('./config/clientPassportStrategy');
const { connectSQL, connectMongoDB } = require('./config/dbInitialization');
// const { connectLogger } = require('./config/logsInitialization');
const app = express();

// Middleware for response handling.
app.use(require('./utils/response/responseHandler'));

const corsOptions = { origin: process.env.ALLOW_ORIGIN };
app.use(cors(corsOptions));

// Template engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Configure Passport strategy for clients
clientPassportStrategy(passport);

// Logger middleware for development
app.use(logger('dev'));

// Parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Initialize SQL and MongoDB connections in development and test environments
if (process.env.NODE_ENV === TEST || process.env.NODE_ENV === DEV) {
  connectSQL(app);
  connectMongoDB(app);
  // connectLogger(app)
  app.listen(process.env.PORT, () => {
    console.log(`Your application is running on port ${process.env.PORT}`);
  });
} else {
  module.exports = app; // Export the app for other modules to use.
}
