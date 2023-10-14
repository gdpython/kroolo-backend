/**
 * Controller for group methods related to all user types.
 * @module controllers/v1/channels/groupController
 */
const model = require('../../../model/mongoose');
const { findOne, createOne, updateOne } = require('../../../utils/mongooseService');

/**
 * Handles the retrieval of group data by its ID.
 *
 * @function
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 */
const getGroups = async (req, res) => {
    try {
        /**
         * Retrieves group data by its unique ID.
         *
         * @param {string} groupID - The unique identifier of the group.
         */
        const { groupID } = req.params;

        /**
         * The retrieved group data.
         * @typedef {Object} groupData
         * @property {string} groupName - The name of the group.
         */

        /**
         * The group data fetched successfully response.
         * @typedef {Object} SuccessResponse
         * @property {groupData} data - The group data.
         * @property {string} message - A success message.
         */

        const groupData = await findOne(model.Group, { _id: groupID }, { groupName: true });
        if (!groupData) {
            return res.failure({
                message: `Group not found by id(${groupID}).`
            });
        }

        return res.success({
            data: groupData,
            message: 'Group data fetched successfully.'
        });
    } catch (error) {
        return res.internalServerError({ message: error.message });
    }
};

/**
 * Handles the creation of a new group.
 *
 * @function
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 */
const createGroups = async (req, res) => {
    try {
        /**
         * The name of the new group to be created.
         *
         * @param {string} groupName - The name of the group.
         */
        const { groupName } = req.body;

        /**
         * The group data created successfully response.
         * @typedef {Object} SuccessResponse
         * @property {groupData} data - The created group data.
         * @property {string} message - A success message.
         */

        const groupData = await createOne(model.Group, { groupName });
        return res.success({
            data: groupData,
            message: 'group created successfully.'
        });
    } catch (error) {
        return res.internalServerError({ message: error.message });
    }
};

/**
 * Handles the update of an group's name by its ID.
 *
 * @function
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 */
const updateGroups = async (req, res) => {
    try {
        /**
         * The updated name of the group.
         *
         * @param {string} groupName - The updated name of the group.
         */
        const { groupName, groupID } = req.body;

        /**
         * The group data updated successfully response.
         * @typedef {Object} SuccessResponse
         * @property {groupData} data - The updated group data.
         * @property {string} message - A success message.
         */

        const groupData = await updateOne(model.Group, { groupName }, { groupID });
        return res.success({
            data: groupData,
            message: 'Group updated successfully.'
        });
    } catch (error) {
        return res.internalServerError({ message: error.message });
    }
};

module.exports = {
    getGroups,
    createGroups,
    updateGroups
};
