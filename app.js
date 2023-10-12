/**
 * app.js
 * Use `app.js` to run your app.
 * To start the server, run: `node app.js`.
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: '.env' });
global.__basedir = __dirname;
const passport = require('passport');
require('./utils/sqlService');
require('./utils/mongooseService');
const models = require('./model/sequalize');
const { TEST, DEV, PROD } = require("./constants/authConstant")

let logger = require('morgan');
const { clientPassportStrategy } = require('./config/clientPassportStrategy');
const { connectSQL, connectMongoDB } = require('./config/dbInitialization');

const app = express();
app.use(require('./utils/response/responseHandler'));

const corsOptions = { origin: process.env.ALLOW_ORIGIN, };
app.use(cors(corsOptions));

//template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
clientPassportStrategy(passport);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

if (process.env.NODE_ENV === TEST || process.env.NODE_ENV === DEV) {
  connectSQL(app)
  connectMongoDB(app)
  app.listen(process.env.PORT, () => {
    console.log(`your application is running on ${process.env.PORT}`);
  });
} else {
  module.exports = app;
}