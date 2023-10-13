/**
 * Constants for task views.
 * @constant
 * @enum {string}
 */
const TASK_VIEW = ["LIST", "KANBAN"];

/**
 * Constants for Cognito user status.
 * @constant
 * @enum {string}
 */
const COGNITO_STATUS = ['ACTIVE', 'VERIFIED', 'NOT VERIFIED', 'FORCE_CHANGE_PASSWORD', 'INACTIVE', 'DELETED'];

/**
 * Constants for invitation status.
 * @constant
 * @enum {string}
 */
const INVITATION_STATUS = ["PENDING", "ACCEPT"];

/**
 * Constants for HTTP route methods.
 * @constant
 * @enum {string}
 */
const ROUTE_METHOD = ["GET", "POST", "PUT", "PATCH", "DELETE"];

/**
 * Constants for workspace types.
 * @constant
 * @enum {string}
 */
const WORKSPACE_TYPE = ['PUBLIC', 'PRIVATE'];

module.exports = {
    TASK_VIEW,
    COGNITO_STATUS,
    INVITATION_STATUS,
    ROUTE_METHOD,
    WORKSPACE_TYPE,
};
