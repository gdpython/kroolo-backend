/**
 * Controller for channels methods related to all user types.
 * @module controllers/v1/channels/channelController
 */

const formidable = require('formidable');
const model = require('../../../model/mongoose');

/**
 * Handles the test of channelController.
 * @function
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 */
const index = (req, res) => {
    try {
        const form = formidable({ multiples: true });
        form.parse(req, async (err, fields, files) => {
            if (err) {
                return res.internalServerError({ message: err.message });
            }
            return res.success({
                data: result.data,
                message: 'Chennel Test.'
            });
        });
    } catch (error) {
        return res.internalServerError({ message: error.message });
    }
};

module.exports = {
    index
};
