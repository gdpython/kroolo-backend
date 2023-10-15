/**
 * index.js
 * @description Express routes for channels APIs.
 */

const express = require('express');

/**
 * Express router for the onboardingController APIs.
 * @type {express.Router}
 */
const router = express.Router();

const { CUURENT_API_VERSION } = require('../../../constants/appConstants');
/**
 * Controller for handling channels operations.
 * @type {object}
 */
const organizationController = require(`../../../controllers/${CUURENT_API_VERSION}/organization/organizationController`);
const workspaceController = require(`../../../controllers/${CUURENT_API_VERSION}/workspace/workspaceController`);
const projectController = require(`../../../controllers/${CUURENT_API_VERSION}/project/projectController`);
const groupsController = require(`../../../controllers/${CUURENT_API_VERSION}/groups/groupsController`);
const taskController = require(`../../../controllers/${CUURENT_API_VERSION}/task/taskController`);
const roleController = require(`../../../controllers/${CUURENT_API_VERSION}/role/roleController`);

/**
 * Route for onboarding create/update/read organization.
 * @name POST /channels
 * @function
 * @param {string} platform - The platform for channels
 * @param {string} project - The project for channels.
 * @param {function} channelController.index - The controller method for onboarding login.
 */
router.get('/organization/:organizationID', organizationController.getOrganization);
router.post('/organization', organizationController.createOrganization);
router.patch('/organization', organizationController.updateOrganization);

router.get('/role', roleController.getAllRole);

router.get('/workspace/list/:organizationID', workspaceController.getAllWorkspace);
router.get('/workspace/:workspaceID', workspaceController.getWorkspace);
router.post('/workspace', workspaceController.createWorkspace);
router.patch('/workspace', workspaceController.updateWorkspace);

router.get('/project', projectController.getProject);
router.post('/project', projectController.createProject);
router.patch('/project', projectController.updateProject);

router.get('/groups', groupsController.getGroups);
router.post('/groups', groupsController.createGroups);
router.patch('/groups', groupsController.updateGroups);

router.get('/task', taskController.getTask);
router.post('/task', taskController.createTask);
router.patch('/task', taskController.updateTask);

router.patch('/dashboard', projectController.updateProjectView);

module.exports = router;
