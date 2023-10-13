/**
 * responseHandler.js
 * @description :: exports all handlers for response format.
 */

const responseBody = require('./index');
const responseCode = require('./responseCode');

/**
 * Middleware for handling response formatting.
 *
 * @param {object} req - Request from the controller.
 * @param {object} res - Response from the controller.
 * @param {function} next - Function to execute the next middleware in the chain.
 */
const responseHandler = (req, res, next) => {
  /**
   * Send a success response with optional data.
   *
   * @param {object} data - Additional data to include in the response.
   */
  res.success = (data = {}) => {
    res.status(responseCode.success).json(responseBody.success(data));
  };

  /**
   * Send a failure response with optional data.
   *
   * @param {object} data - Additional data to include in the response.
   */
  res.failure = (data = {}) => {
    res.status(responseCode.failure).json(responseBody.failure(data));
  };

  /**
   * Send an internal server error response with optional data.
   *
   * @param {object} data - Additional data to include in the response.
   */
  res.internalServerError = (data = {}) => {
    res.status(responseCode.internalServerError).json(responseBody.internalServerError(data));
  };

  /**
   * Send a bad request response with optional data.
   *
   * @param {object} data - Additional data to include in the response.
   */
  res.badRequest = (data = {}) => {
    res.status(responseCode.badRequest).json(responseBody.badRequest(data));
  };

  /**
   * Send a record not found response with optional data.
   *
   * @param {object} data - Additional data to include in the response.
   */
  res.recordNotFound = (data = {}) => {
    res.status(responseCode.recordNotFound).json(responseBody.recordNotFound(data));
  };

  /**
   * Send a validation error response with optional data.
   *
   * @param {object} data - Additional data to include in the response.
   */
  res.validationError = (data = {}) => {
    res.status(responseCode.validationError).json(responseBody.validationError(data));
  };

  /**
   * Send an unauthorized response with optional data.
   *
   * @param {object} data - Additional data to include in the response.
   */
  res.unAuthorized = (data = {}) => {
    res.status(responseCode.unAuthorized).json(responseBody.unAuthorized(data));
  };

  // Call the next middleware in the chain
  next();
};

module.exports = responseHandler;
