/**
 * Controller for organization methods related to all user types.
 * @module controllers/v1/channels/channelController
 */

const formidable = require('formidable');
const model = require('../../../model/mongoose');

/**
 * Handles the test of organizationController.
 * @function
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 */
const getOrganization = (req, res) => {
    const { organizationID } = req.params
    try {
        return res.success({
            data: null,
            message: 'org Test.'
        });
    } catch (error) {
        return res.internalServerError({ message: error.message });
    }
};

module.exports = {
    getOrganization
};
