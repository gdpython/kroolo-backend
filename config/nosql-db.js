/**
 * @description Exports values used to make a connection with the NoSQL database.
 * @module nosql-db
 */

const { TEST, DEV, PROD } = require("../constants/authConstant");

/**
 * NoSQL database connection configuration based on the environment.
 *
 * @type {object}
 * @property {string} URI - The MongoDB connection URI.
 * @property {object} OPTIONS - The connection options for MongoDB.
 */
let nosqlDbConfig;

switch (process.env.NODE_ENV) {
  case TEST:
    nosqlDbConfig = {
      URI: process.env.TEST_MONGO_URI,
      OPTIONS: {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
      },
    };
    break;
  case DEV:
    nosqlDbConfig = {
      URI: process.env.DEV_MONGO_URI,
      OPTIONS: {
        // Uncomment and add specific options for development if needed.
      },
    };
    break;
  case PROD:
    nosqlDbConfig = {
      URI: process.env.PROD_MONGO_URI,
      OPTIONS: {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
      },
    };
    break;
  default:
    // Handle other cases or provide a default configuration.
    nosqlDbConfig = {
      URI: "mongodb://localhost:27017/mydb",
      OPTIONS: {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
      },
    };
    break;
}

/**
 * Exports the NoSQL database configuration.
 *
 * @type {object}
 */
module.exports = nosqlDbConfig;
