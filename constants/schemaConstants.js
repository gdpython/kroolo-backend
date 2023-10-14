/**
 * Constants for task views.
 * @constant
 * @enum {string}
 */
const TASK_VIEW = ['LIST', 'KANBAN'];

/**
 * Constants for Cognito user status.
 * @constant
 * @enum {string}
 */
const COGNITO_STATUS = [
    'ACTIVE',
    'VERIFIED',
    'NOT VERIFIED',
    'FORCE_CHANGE_PASSWORD',
    'INACTIVE',
    'DELETED',
];

/**
 * Constants for invitation status.
 * @constant
 * @enum {string}
 */
const INVITATION_STATUS = ['PENDING', 'ACCEPT'];

/**
 * Constants for HTTP route methods.
 * @constant
 * @enum {string}
 */
const ROUTE_METHOD = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];

/**
 * Constants for workspace types.
 * @constant
 * @enum {string}
 */
const WORKSPACE_TYPE = ['PUBLIC', 'PRIVATE'];

/**
 * Constants for project status.
 * @constant
 * @enum {string}
 */
const PROJECT_STATUS = [
    'Not Started',
    'On Track',
    'At Risk',
    'Delayed',
    'On Hold',
    'Canceled',
    'Completed',
];

/**
 * Constants for goal type.
 * @constant
 * @enum {string}
 */

const GOAL_TYPE = ['Goal', 'SubGoal'];

/**
 * Constants for goal collaborator type.
 * @constant
 * @enum {string}
 */

const GOAL_COLLABORATOR_TYPE = ['Personal', 'Team']

/**
 * Constants for goal status.
 * @constant
 * @enum {string}
 */

const GOAL_STATUS = [
    'Not Started',
    'On Track',
    'At Risk',
    'Delayed',
    'On Hold',
    'Partial',
    'Pending',
    'Achieved',
    'Closed',
    'Archived',
];

/**
 * Constants for goal key result measurement unit.
 * @constant
 * @enum {string}
 */

const GOAL_KEY_RESULT_MEASUREMENT_UNIT = [
    'Number',
    'Percentage',
    'Currency',
    'Boolean',
    'Custom',
];

/**
 * Constants for project priority.
 * @constant
 * @enum {string}
 */

const PROJECT_PRIORITY = ['Urgent', 'High', 'Medium', 'Low'];

module.exports = {
    TASK_VIEW,
    COGNITO_STATUS,
    INVITATION_STATUS,
    ROUTE_METHOD,
    WORKSPACE_TYPE,
    PROJECT_STATUS,
    PROJECT_PRIORITY,
    GOAL_STATUS,
    GOAL_TYPE,
    GOAL_COLLABORATOR_TYPE,
    GOAL_KEY_RESULT_MEASUREMENT_UNIT
};
