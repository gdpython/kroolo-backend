/**
 * An identifier for a successful response.
 * @constant
 * @type {string}
 */
const success = 'SUCCESS';

/**
 * An identifier for a failure response.
 * @constant
 * @type {string}
 */
const failure = 'FAILURE';

/**
 * An identifier for a server error response.
 * @constant
 * @type {string}
 */
const serverError = 'SERVER_ERROR';

/**
 * An identifier for a bad request response.
 * @constant
 * @type {string}
 */
const badRequest = 'BAD_REQUEST';

/**
 * An identifier for a record not found response.
 * @constant
 * @type {string}
 */
const recordNotFound = 'RECORD_NOT_FOUND';

/**
 * An identifier for a validation error response.
 * @constant
 * @type {string}
 */
const validationError = 'VALIDATION_ERROR';

/**
 * An identifier for an unauthorized response.
 * @constant
 * @type {string}
 */
const unauthorized = 'UNAUTHORIZED';

module.exports = {
  success,
  failure,
  serverError,
  badRequest,
  recordNotFound,
  validationError,
  unauthorized,
};
