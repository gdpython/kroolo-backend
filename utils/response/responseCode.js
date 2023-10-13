/**
 * HTTP status codes for success response (200 OK).
 * @constant
 * @type {number}
 */
const success = 200;

/**
 * HTTP status codes for bad request response (400 Bad Request).
 * @constant
 * @type {number}
 */
const badRequest = 400;

/**
 * HTTP status codes for internal server error response (500 Internal Server Error).
 * @constant
 * @type {number}
 */
const internalServerError = 500;

/**
 * HTTP status codes for unauthorized response (401 Unauthorized).
 * @constant
 * @type {number}
 */
const unAuthorized = 401;

/**
 * HTTP status codes for validation error response (422 Unprocessable Entity).
 * @constant
 * @type {number}
 */
const validationError = 422;

module.exports = {
  success,
  badRequest,
  internalServerError,
  unAuthorized,
  validationError,
};
