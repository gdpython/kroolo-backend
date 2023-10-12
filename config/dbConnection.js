/**
 * dbConnection.js
 * @description :: database connection using sequelize and mongoose
 */

const { Sequelize } = require('sequelize');
const mongoose = require("mongoose");

const dbConfigSequalize = require('./sql-db');
const dbConfigMongoose = require('./nosql-db');


const sequelize = new Sequelize(dbConfigSequalize.DB, dbConfigSequalize.USER, dbConfigSequalize.PASSWORD, {
    host: dbConfigSequalize.HOST,
    dialect: dbConfigSequalize.dialect,
    port: dbConfigSequalize.port,
    logging: false
});
const mongooseConnection = ()=>mongoose.connect(dbConfigMongoose.URI, dbConfigMongoose.OPTIONS);
module.exports = { sequelize, mongoose:mongooseConnection };