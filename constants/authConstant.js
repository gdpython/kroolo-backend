/**
 * @description Constants used in authentication.
 * @module authConstant
 */

/**
 * Test environment.
 * @constant {string}
 */
const TEST = "test";

/**
 * Development environment.
 * @constant {string}
 */
const DEV = "dev";

/**
 * Production environment.
 * @constant {string}
 */
const PROD = "prod";

/**
 * JWT related constants.
 * @namespace
 */
const JWT = {
  /**
   * Web secret for JWT.
   * @constant {string}
   */
  WEB_SECRET: process.env.JWT_CLIENT_SECRET,

  /**
   * App secret for JWT.
   * @constant {string}
   */
  APP_SECRET: process.env.JWT_APP_SECRET,

  /**
   * Expiration time for JWT tokens.
   * @constant {number}
   */
  EXPIRES_IN: 10000,
};

/**
 * Crypto password.
 * @constant {string}
 */
const CRYPTO_PASSWORD = process.env.CRYPTO_PASSWORD;

/**
 * User types.
 * @namespace
 */
const USER_TYPES = {
  /**
   * User type.
   * @constant {number}
   */
  User: 1,
};

/**
 * Member path name.
 * @constant {string}
 */
const MEMBER_PATH_NAME = '/members';

/**
 * Platform constants.
 * @namespace
 */
const PLATFORM = {
  /**
   * Web platform.
   * @constant {number}
   */
  WEB: 1,

  /**
   * App platform.
   * @constant {number}
   */
  APP: 2,
};

/**
 * Platform access constants.
 * @namespace
 */
const PLATFORM_ACCESS = {
  /**
   * Owner access.
   * @constant {string}
   */
  OWNER: 'OWNER',

  /**
   * Members access.
   * @constant {string}
   */
  MEMBERS: 'MEMBERS',
};

/**
 * Database type constants.
 * @namespace
 */
const DB_TYPE = {
  /**
   * SQL database type.
   * @constant {string}
   */
  SQL: "sql",

  /**
   * NoSQL database type.
   * @constant {string}
   */
  NOSQL: "nosql",
};

module.exports = {
  DB_TYPE,
  TEST,
  DEV,
  PROD,
  JWT,
  CRYPTO_PASSWORD,
  USER_TYPES,
  MEMBER_PATH_NAME,
  PLATFORM,
  PLATFORM_ACCESS,
};
