/**
 * Controller for authentication methods related to owners.
 * @module controllers/v1/authentication/authController
 */

const ownerAuthService = require('../../../services/mongoose/auth');
const model = require('../../../model/mongoose');
const { PLATFORM_ACCESS } = require('../../../constants/authConstant');
const formidable = require('formidable');

/**
 * Handles the login of an owner.
 * @function
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 */
const ownerLogin = (req, res) => {
    try {
        const form = formidable({ multiples: true });
        form.parse(req, async (err, fields, files) => {
            if (err) {
                return res.internalServerError({ message: err.message });
            }
            let {
                email, password
            } = fields;

            if (!email || !password) {
                return res.badRequest({ message: 'Insufficient request parameters! email and password are required.' });
            }
            var ip = req.socket.remoteAddress;
            let result = await ownerAuthService.login(email, password, model.owner, ['id', 'schoolSessionName', 'email', 'primaryEmail', 'password', 'isActive', 'currentLoginIP', 'roleName'], ip, PLATFORM_ACCESS.OWNER);
            if (result.flag) {
                return res.badRequest({ message: result.data });
            }
            return res.success({
                data: result.data,
                message: 'Login successful.'
            });
        });
    } catch (error) {
        return res.internalServerError({ message: error.message });
    }
};

module.exports = {
    ownerLogin
};
