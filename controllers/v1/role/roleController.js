/**
 * Controller for role methods related to all user types.
 * @module controllers/v1/role/roleController
 */

const model = require('../../../model/mongoose');
const { findOne, createOne, updateOne, findAll } = require('../../../utils/mongooseService');

/**
 * Handles the retrieval of role list.
 *
 * @function
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 */
const getAllRole = async (req, res) => {
    try {
        /**
         * Retrieves role list.
         */

        /**
         * The retrieved workspace data.
         * @typedef {Object} roleListData
         */

        /**
         * The role data fetched successfully response.
         * @typedef {Object} SuccessResponse
         * @property {roleListData} data - The role data.
         * @property {string} message - A success message.
         */

        const roleListData = await findAll(model.Role);
        if (!roleListData) {
            return res.failure({
                message: `role list not found.`
            });
        }

        return res.success({
            data: roleListData,
            message: 'role list data fetched successfully.'
        });
    } catch (error) {
        return res.internalServerError({ message: error.message });
    }
};

module.exports = {
    getAllRole,
};
