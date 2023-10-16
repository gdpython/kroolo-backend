/**
 * Controller for user methods related to owners.
 * @module controllers/v1/user/userController
 */

const ownerAuthService = require('../../../services/mongoose/auth');
const model = require('../../../model/mongoose');

/**
 * Handles the change password.
 * @function
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 */

const changePassword = async (req, res) => {
    let { currentPassword, newPassword, email } = req.body;
    const token = req.headers.authorization.split(" ")[1];
    console.log(token, 'tokennnn');
    if (!currentPassword || !newPassword || !email || !token) {
      return res.badRequest({
        message:
          "Insufficient request parameters! currentPassword and newPassword and email are required.",
      });
    }
  
    let result = await ownerAuthService.changePassword(
      token,
      email,
      currentPassword,
      newPassword,
      model.User,
    );
  
    if (result.flag) {
      return res.badRequest({ message: result.data });
    }
    return res.success({
      message: "Password changed successfully.",
    });
  };
  module.exports = {
    changePassword
  }