/**
 * @description Exports values used to make a connection with SQL database.
 * @module sql-db
 */

const { TEST, DEV, PROD } = require("../constants/authConstant");

/**
 * SQL database connection configuration based on the environment.
 *
 * @type {object}
 * @property {string} HOST - The database host.
 * @property {string} USER - The database username.
 * @property {string} PASSWORD - The database password.
 * @property {string} DB - The database name.
 * @property {string} dialect - The database dialect (e.g., 'mysql').
 * @property {number} port - The database port.
 * @property {object} dialectOptions - Additional dialect options for the database connection.
 * @property {string} timezone - The timezone for the database connection.
 */
let sqlDbConfig;

switch (process.env.NODE_ENV) {
  case TEST:
    sqlDbConfig = {
      HOST: process.env.TEST_HOST,
      USER: process.env.TEST_DATABASE_USERNAME,
      PASSWORD: process.env.TEST_DATABASE_PASSWORD,
      DB: process.env.TEST_DATABASE_NAME,
      dialect: 'mysql',
      port: process.env.TEST_DB_PORT,
      dialectOptions: {
        useUTC: false,
        timezone: '+05:30',
      },
      timezone: '+05:30',
    };
    break;
  case DEV:
    sqlDbConfig = {
      HOST: process.env.DEV_HOST,
      USER: process.env.DEV_DATABASE_USERNAME,
      PASSWORD: process.env.DEV_DATABASE_PASSWORD,
      DB: process.env.DEV_DATABASE_NAME,
      dialect: 'mysql',
      port: process.env.DEV_DB_PORT,
      dialectOptions: {
        useUTC: false,
        timezone: '+05:30',
      },
      timezone: '+05:30',
    };
    break;
  case PROD:
    sqlDbConfig = {
      HOST: process.env.PROD_HOST,
      USER: process.env.PROD_DATABASE_USERNAME,
      PASSWORD: process.env.PROD_DATABASE_PASSWORD,
      DB: process.env.PROD_DATABASE_NAME,
      dialect: 'mysql',
      port: process.env.PROD_DB_PORT,
      dialectOptions: {
        useUTC: false,
        timezone: '+05:30',
      },
      timezone: '+05:30',
    };
    break;
  default:
    // Handle other cases or provide a default configuration.
    sqlDbConfig = {
      HOST: 'localhost',
      USER: 'root',
      PASSWORD: 'password',
      DB: 'mydb',
      dialect: 'mysql',
      port: 3306,
      dialectOptions: {
        useUTC: false,
        timezone: '+05:30',
      },
      timezone: '+05:30',
    };
    break;
}

/**
 * Exports the SQL database configuration.
 *
 * @type {object}
 */
module.exports = sqlDbConfig;
