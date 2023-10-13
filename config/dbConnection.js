/**
 * @description Database connection using Sequelize and Mongoose.
 * @module dbConnection
 */

const { Sequelize } = require('sequelize');
const mongoose = require("mongoose");

// Load configuration for Sequelize and Mongoose
const dbConfigSequalize = require('./sql-db');
const dbConfigMongoose = require('./nosql-db');

/**
 * Sequelize database connection.
 * @type {Sequelize}
 */
const sequelize = new Sequelize(dbConfigSequalize.DB, dbConfigSequalize.USER, dbConfigSequalize.PASSWORD, {
    host: dbConfigSequalize.HOST,
    dialect: dbConfigSequalize.dialect,
    port: dbConfigSequalize.port,
    logging: false
});

/**
 * Mongoose database connection function.
 * @function
 * @returns {Promise<mongoose.Connection>} A promise that resolves to a Mongoose connection object.
 */
const mongooseConnection = () => mongoose.connect(dbConfigMongoose.URI, dbConfigMongoose.OPTIONS);

module.exports = {
    sequelize,
    mongoose: mongooseConnection
};
