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
const ownerLogin = async (req, res) => {
  try {
    let { email, password } = req.body;

    if (!email || !password) {
      return res.badRequest({
        message:
          "Insufficient request parameters! email and password are required.",
      });
    }
    var ip = req.socket.remoteAddress;
    let result = await ownerAuthService.login(
      email,
      password,
      model.User,
      ip,
    );
    if (result.flag) {
      return res.badRequest({ message: result.data });
    }
    return res.success({
      data: result.data,
      message: "Login successful.",
    });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

const signUp = async (req, res) => {
  let { email } = req.body;
  if (!email) {
    return res.badRequest({
      message:
        "Insufficient request parameters! email are required.",
    });
  }
  var ip = req.socket.remoteAddress;
  let result = await ownerAuthService.signUp(
    req.get("origin"),
    email,
    model.User,
    ip,
  );
  if (result.flag) {
    return res.badRequest({ message: result.data });
  }
  return res.success({
    message: "Signup successful.",
  });
};

module.exports = {
  ownerLogin,
  signUp
};
