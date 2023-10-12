/**
 * nosql-db.js
 * @description :: exports values used to make connection with NoSQL database
 */
const { TEST, DEV, PROD} = require("../constants/authConstant")
switch (process.env.NODE_ENV) {
    case TEST:
        module.exports = {
            URI: process.env.TEST_MONGO_URI,
            OPTIONS: {
                useNewUrlParser: true,
                useCreateIndex: true,
                useFindAndModify: false,
                useUnifiedTopology: true,
            }
        };
        break;
    case DEV:
        module.exports = {
            URI: process.env.DEV_MONGO_URI,
            OPTIONS: {
                // useNewUrlParser: true,
                // useCreateIndex: true,
                // useFindAndModify: false,
                // useUnifiedTopology: true,
            }
        };
        break;
    case PROD:
        module.exports = {
            URI: process.env.PROD_MONGO_URI,
            OPTIONS: {
                useNewUrlParser: true,
                useCreateIndex: true,
                useFindAndModify: false,
                useUnifiedTopology: true,
            }
        };
        break;
    default:
        break;
}