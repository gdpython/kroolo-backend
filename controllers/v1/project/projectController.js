/**
 * Controller for project methods related to all user types.
 * @module controllers/v1/channels/projectController
 */
const model = require('../../../model/mongoose');
const { findOne, createOne, updateOne } = require('../../../utils/mongooseService');

/**
 * Handles the retrieval of project data by its ID.
 *
 * @function
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 */
const getProject = async (req, res) => {
    try {
        /**
         * Retrieves project data by its unique ID.
         *
         * @param {string} projectID - The unique identifier of the project.
         */
        const { projectID } = req.params;

        /**
         * The retrieved project data.
         * @typedef {Object} projectData
         * @property {string} projectName - The name of the project.
         */

        /**
         * The project data fetched successfully response.
         * @typedef {Object} SuccessResponse
         * @property {projectData} data - The project data.
         * @property {string} message - A success message.
         */

        const projectData = await findOne(model.Project, { _id: projectID }, { projectName: true });
        if (!projectData) {
            return res.failure({
                message: `Project not found by id(${projectID}).`
            });
        }

        return res.success({
            data: projectData,
            message: 'Project data fetched successfully.'
        });
    } catch (error) {
        return res.internalServerError({ message: error.message });
    }
};

/**
 * Handles the creation of a new project.
 *
 * @function
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 */
const createProject = async (req, res) => {
    try {
        /**
         * The name of the new project to be created.
         *
         * @param {string} projectName - The name of the project.
         */
        const { projectName } = req.body;

        /**
         * The project data created successfully response.
         * @typedef {Object} SuccessResponse
         * @property {projectData} data - The created project data.
         * @property {string} message - A success message.
         */

        const projectData = await createOne(model.Project, { projectName });
        return res.success({
            data: projectData,
            message: 'Project created successfully.'
        });
    } catch (error) {
        return res.internalServerError({ message: error.message });
    }
};

/**
 * Handles the update of an project's name by its ID.
 *
 * @function
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 */
const updateProject = async (req, res) => {
    try {
        /**
         * The updated name of the project.
         *
         * @param {string} projectName - The updated name of the project.
         */
        const { projectName, projectID } = req.body;

        /**
         * The project data updated successfully response.
         * @typedef {Object} SuccessResponse
         * @property {projectData} data - The updated project data.
         * @property {string} message - A success message.
         */

        const projectData = await updateOne(model.Project, { projectName }, { projectID });
        return res.success({
            data: projectData,
            message: 'Project updated successfully.'
        });
    } catch (error) {
        return res.internalServerError({ message: error.message });
    }
};
/**
 * Handles the update of an project's view type by its ID.
 *
 * @function
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 */
const updateProjectView = async (req, res) => {
    try {
        /**
         * The updated name of the project.
         *
         * @param {string} projectName - The updated name of the project.
         */
        const { projectName, projectID } = req.body;

        /**
         * The project data updated successfully response.
         * @typedef {Object} SuccessResponse
         * @property {projectData} data - The updated project data.
         * @property {string} message - A success message.
         */

        const projectData = await updateOne(model.Project, { projectName }, { projectID });
        return res.success({
            data: projectData,
            message: 'Project updated successfully.'
        });
    } catch (error) {
        return res.internalServerError({ message: error.message });
    }
};

module.exports = {
    getProject,
    createProject,
    updateProject,
    updateProjectView
};
