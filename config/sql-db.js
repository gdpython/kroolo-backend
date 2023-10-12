/**
 * sql-db.js
 * @description :: exports values used to make connection with SQL database
 */
const { TEST, DEV, PROD} = require("../constants/authConstant")

switch (process.env.NODE_ENV) {
    case TEST:
        module.exports = {
            HOST: process.env.TEST_HOST,
            USER: process.env.TEST_DATABASE_USERNAME,
            PASSWORD: process.env.TEST_DATABASE_PASSWORD,
            DB: process.env.TEST_DATABASE_NAME,
            dialect: 'mysql',
            port: process.env.TEST_DB_PORT,
            dialectOptions: {
                useUTC: false,
                timezone: '+05:30'
            },
            timezone: '+05:30'
        };
        break;
    case DEV:
        module.exports = {
            HOST: process.env.DEV_HOST,
            USER: process.env.DEV_DATABASE_USERNAME,
            PASSWORD: process.env.DEV_DATABASE_PASSWORD,
            DB: process.env.DEV_DATABASE_NAME,
            dialect: 'mysql',
            port: process.env.DEV_DB_PORT,
            dialectOptions: {
                useUTC: false,
                timezone: '+05:30'
            },
            timezone: '+05:30'
        };
        break;
    case PROD:
        module.exports = {
            HOST: process.env.PROD_HOST,
            USER: process.env.PROD_DATABASE_USERNAME,
            PASSWORD: process.env.PROD_DATABASE_PASSWORD,
            DB: process.env.PROD_DATABASE_NAME,
            dialect: 'mysql',
            port: process.env.PROD_DB_PORT,
            dialectOptions: {
                useUTC: false,
                timezone: '+05:30'
            },
            timezone: '+05:30'
        };
        break;
    default:
        break;
}