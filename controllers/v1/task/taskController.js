/**
 * Controller for task methods related to all user types.
 * @module controllers/v1/channels/taskController
 */
const model = require('../../../model/mongoose');
const { findOne, createOne, updateOne } = require('../../../utils/mongooseService');

/**
 * Handles the retrieval of task data by its ID.
 *
 * @function
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 */
const getTask = async (req, res) => {
    try {
        /**
         * Retrieves task data by its unique ID.
         *
         * @param {string} taskID - The unique identifier of the task.
         */
        const { taskID } = req.params;

        /**
         * The retrieved task data.
         * @typedef {Object} taskData
         * @property {string} taskName - The name of the task.
         */

        /**
         * The task data fetched successfully response.
         * @typedef {Object} SuccessResponse
         * @property {taskData} data - The task data.
         * @property {string} message - A success message.
         */

        const taskData = await findOne(model.Task, { _id: taskID }, { taskName: true });
        if (!taskData) {
            return res.failure({
                message: `Task not found by id(${taskID}).`
            });
        }

        return res.success({
            data: taskData,
            message: 'Task data fetched successfully.'
        });
    } catch (error) {
        return res.internalServerError({ message: error.message });
    }
};

/**
 * Handles the creation of a new task.
 *
 * @function
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 */
const createTask = async (req, res) => {
    try {
        /**
         * The name of the new task to be created.
         *
         * @param {string} taskName - The name of the task.
         */
        const { taskName } = req.body;

        /**
         * The task data created successfully response.
         * @typedef {Object} SuccessResponse
         * @property {taskData} data - The created task data.
         * @property {string} message - A success message.
         */

        const taskData = await createOne(model.Task, { taskName });
        return res.success({
            data: taskData,
            message: 'task created successfully.'
        });
    } catch (error) {
        return res.internalServerError({ message: error.message });
    }
};

/**
 * Handles the update of an task's name by its ID.
 *
 * @function
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 */
const updateTask = async (req, res) => {
    try {
        /**
         * The updated name of the task.
         *
         * @param {string} taskName - The updated name of the task.
         */
        const { taskName, taskID } = req.body;

        /**
         * The task data updated successfully response.
         * @typedef {Object} SuccessResponse
         * @property {taskData} data - The updated task data.
         * @property {string} message - A success message.
         */

        const taskData = await updateOne(model.Task, { taskName }, { taskID });
        return res.success({
            data: taskData,
            message: 'Task updated successfully.'
        });
    } catch (error) {
        return res.internalServerError({ message: error.message });
    }
};

module.exports = {
    getTask,
    createTask,
    updateTask
};
