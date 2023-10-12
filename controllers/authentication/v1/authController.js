/**
 * authController.js
 * @description :: exports authentication methods for owner
 */
const ownerAuthService = require('../../../services');
const model = require('../../../model/sequalize');
const { PLATFORM_ACCESS } = require('../../../constants/authConstant');
const formidable = require('formidable');

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
                return res.badRequest({ message: 'Insufficient request parameters! email and password is required.' });
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