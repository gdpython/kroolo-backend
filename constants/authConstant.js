/**
 * authConstant.js
 * @description :: constants used in authentication
 */
const TEST = "test"
const DEV = "dev"
const PROD = "prod"
const JWT = {
  WEB_SECRET: process.env.JWT_CLIENT_SECRET,
  APP_SECRET: process.env.JWT_APP_SECRET,
  EXPIRES_IN: 10000
};
const CRYPTO_PASSWORD = process.env.CRYPTO_PASSWORD
const USER_TYPES = { User: 1 };
const MEMBER_PATH_NAME = '/members';
const PLATFORM = {
  WEB: 1,
  APP: 2,
};
const PLATFORM_ACCESS = {
  OWNER: 'OWNER',
  MEMBERs: 'MEMBERs',
};
const DB_TYPE={
  SQL:"sql",
  NOSQL:"nosql",
}
module.exports = {
  DB_TYPE,
  TEST,DEV,PROD,
  JWT,
  CRYPTO_PASSWORD,
  USER_TYPES,
  MEMBER_PATH_NAME,
  PLATFORM,
  PLATFORM_ACCESS
}