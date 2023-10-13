/**
 * @description The current API version.
 * @type {string}
 */
const CUURENT_API_VERSION = process.env.CUURENT_API_VERSION;
/**
 * @description The module routes prefix for all routes association.
 * @type {object}
 */
const MODULE_ROUTES = {
    USERS:"users"
};

/**
 * Export the current API version.
 * @type {object}
 */
module.exports = {
    CUURENT_API_VERSION,
    MODULE_ROUTES
};
