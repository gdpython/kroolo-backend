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
    USERS: "users"
};

/**
 * @description The module encryption and descryption.
 * @type {object}
 */
const ENC_TYPE = ['ENC', 'DEC'];


 /**
 * @description A collection of module names for each API association.
 * @type {object}
 */
const MODULE_NAME = {
    /**
     * The module name for authentication-related APIs.
     * @type {string}
     */
    AUTHENTICATION: "AUTHENTICATION",
    /**
        * The module name for workspace-related APIs.
        * @type {string}
        */
    WORKSPACE: "WORKSPACE",

    /**
     * The module name for channels-related APIs.
     * @type {string}
     */
    CHANNELS: "CHANNELS",

    /**
     * The module name for documentation-related APIs.
     * @type {string}
     */
    DOCS: "DOCS",

    /**
     * The module name for goals-related APIs.
     * @type {string}
     */
    GOALS: "GOALS",

    /**
     * The module name for projects-related APIs.
     * @type {string}
     */
    PROJECTS: "PROJECTS",

    /**
     * The module name for settings-related APIs.
     * @type {string}
     */
    SETTING: "SETTING",

    /**
     * The module name for teams-related APIs.
     * @type {string}
     */
    TEAMS: "TEAMS",
};
/**
 * Export the current API version.
 * @type {object}
 */
module.exports = {
    CUURENT_API_VERSION,
    MODULE_ROUTES,
    MODULE_NAME,
    ENC_TYPE
};
