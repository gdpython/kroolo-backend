/**
 * Controller for workspace methods related to all user types.
 * @module controllers/v1/channels/workspaceController
 */

const model = require('../../../model/mongoose');
const { findOne, createOne, updateOne, findAll } = require('../../../utils/mongooseService');

/**
 * Handles the retrieval of workspace data by its ID.
 *
 * @function
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 */
const getWorkspace = async (req, res) => {
    try {
        /**
         * Retrieves workspace data by its unique ID.
         *
         * @param {string} workspaceID - The unique identifier of the workspace.
         */
        const { workspaceID } = req.params;

        /**
         * The retrieved workspace data.
         * @typedef {Object} workspaceData
         * @property {string} workspaceName - The name of the workspace.
         */

        /**
         * The workspace data fetched successfully response.
         * @typedef {Object} SuccessResponse
         * @property {workspaceData} data - The workspace data.
         * @property {string} message - A success message.
         */

        const workspaceData = await findOne(model.Workspace, { _id: workspaceID }, { workspaceName: true });
        if (!workspaceData) {
            return res.failure({
                message: `workspace not found by id(${workspaceID}).`
            });
        }

        return res.success({
            data: workspaceData,
            message: 'workspace data fetched successfully.'
        });
    } catch (error) {
        return res.internalServerError({ message: error.message });
    }
};

/**
 * Handles the creation of a new workspace.
 *
 * @function
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 */
const createWorkspace = async (req, res) => {
    try {
        /**
         * The name of the new workspace to be created.
         *
         * @param {string} workspaceName - The name of the workspace.
         */
        const { workspaceName, organizationID } = req.body;

        /**
         * The workspace data created successfully response.
         * @typedef {Object} SuccessResponse
         * @property {workspaceData} data - The created workspace data.
         * @property {string} message - A success message.
         */

        const workspaceData = await createOne(model.Workspace, { workspaceName, organizationID, createdBy: req.user._id });
        return res.success({
            data: workspaceData,
            message: 'workspace created successfully.'
        });
    } catch (error) {
        return res.internalServerError({ message: error.message });
    }
};

/**
 * Handles the update of an workspace's name by its ID.
 *
 * @function
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 */
const updateWorkspace = async (req, res) => {
    try {
        /**
         * The updated name of the workspace.
         *
         * @param {string} workspaceName - The updated name of the workspace.
         */
        const { workspaceName, workspaceID } = req.body;

        /**
         * The workspace data updated successfully response.
         * @typedef {Object} SuccessResponse
         * @property {workspaceData} data - The updated workspace data.
         * @property {string} message - A success message.
         */

        const workspaceData = await updateOne(model.Workspace, { workspaceName }, { workspaceID });
        return res.success({
            data: workspaceData,
            message: 'workspace updated successfully.'
        });
    } catch (error) {
        return res.internalServerError({ message: error.message });
    }
};

/**
 * Handles the retrieval of workspace list by orgnaization ID.
 *
 * @function
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 */
const getAllWorkspace = async (req, res) => {
    try {
        /**
         * Retrieves workspace list by its unique orgnaization ID.
         *
         * @param {string} organizationID - The unique identifier of the organization.
         */
        const { organizationID } = req.params;

        /**
         * The retrieved workspace data.
         * @typedef {Object} workspaceListData
         * @property {string} workspaceName - The name of the workspace.
         */

        /**
         * The workspace data fetched successfully response.
         * @typedef {Object} SuccessResponse
         * @property {workspaceListData} data - The workspace data.
         * @property {string} message - A success message.
         */

        const workspaceListData = await findAll(model.Workspace, { organizationID, isActive:true }, { workspaceName: true });
        if (!workspaceListData) {
            return res.failure({
                message: `workspace list not found by organization id(${organizationID}).`
            });
        }

        return res.success({
            data: workspaceListData,
            message: 'workspace list data fetched successfully.'
        });
    } catch (error) {
        return res.internalServerError({ message: error.message });
    }
};

module.exports = {
    getWorkspace,
    createWorkspace,
    updateWorkspace,
    getAllWorkspace
};
