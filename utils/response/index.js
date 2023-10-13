const responseStatus = require('./responseStatus');

module.exports = {
  /**
   * Generates a success response object.
   *
   * @param {Object} data - Additional data to include in the response.
   * @returns {Object} A response object with status, message, and data properties.
   */
  success: (data = {}) => {
    return {
      status: responseStatus.success,
      message: data.message || 'Your request is successfully executed',
      data: data.data && Object.keys(data.data).length ? data.data : null,
    };
  },

  /**
   * Generates a failure response object.
   *
   * @param {Object} data - Additional data to include in the response.
   * @returns {Object} A response object with status, message, and data properties.
   */
  failure: (data = {}) => {
    return {
      status: responseStatus.failure,
      message: data.message || 'Some error occurred while performing action.',
      data: data.data && Object.keys(data.data).length ? data.data : null,
    };
  },

  /**
   * Generates an internal server error response object.
   *
   * @param {Object} data - Additional data to include in the response.
   * @returns {Object} A response object with status, message, and data properties.
   */
  internalServerError: (data = {}) => {
    return {
      status: responseStatus.serverError,
      message: data.message || 'Internal server error.',
      data: data.data && Object.keys(data.data).length ? data.data : null,
    };
  },

  /**
   * Generates a bad request response object.
   *
   * @param {Object} data - Additional data to include in the response.
   * @returns {Object} A response object with status, message, and data properties.
   */
  badRequest: (data = {}) => {
    return {
      status: responseStatus.badRequest,
      message: data.message || 'Request parameters are invalid or missing.',
      data: data.data && Object.keys(data.data).length ? data.data : null,
    };
  },

  /**
   * Generates a record not found response object.
   *
   * @param {Object} data - Additional data to include in the response.
   * @returns {Object} A response object with status, message, and data properties.
   */
  recordNotFound: (data = {}) => {
    return {
      status: responseStatus.recordNotFound,
      message: data.message || 'Record(s) not found with specified criteria.',
      data: data.data && Object.keys(data.data).length ? data.data : null,
    };
  },

  /**
   * Generates a validation error response object.
   *
   * @param {Object} data - Additional data to include in the response.
   * @returns {Object} A response object with status, message, and data properties.
   */
  validationError: (data = {}) => {
    return {
      status: responseStatus.validationError,
      message: data.message || 'Invalid Data, Validation Failed.',
      data: data.data && Object.keys(data.data).length ? data.data : null,
    };
  },

  /**
   * Generates an unauthorized response object.
   *
   * @param {Object} data - Additional data to include in the response.
   * @returns {Object} A response object with status, message, and data properties.
   */
  unAuthorized: (data = {}) => {
    return {
      status: responseStatus.unauthorized,
      message: data.message || 'You are not authorized to access the request',
      data: data.data && Object.keys(data.data).length ? data.data : null,
    };
  },
};
