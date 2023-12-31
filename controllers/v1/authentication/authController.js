/**
 * Controller for authentication methods related to owners.
 * @module controllers/v1/authentication/authController
 */

const ownerAuthService = require('../../../services/mongoose/auth');
const model = require('../../../model/mongoose');

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

/**
 * Handles the signup of a user.
 * @function
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 */

const signUp = async (req, res) => {
  let { email } = req.body;
  if (!email) {
    return res.badRequest({
      message:
        "Insufficient request parameters! email are required.",
    });
  }
  var ip = req.socket.remoteAddress;
  const origin = req.get("origin") || req.get("host")

  let result = await ownerAuthService.signUp(
    origin,
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

/**
 * Handles the verify of a user.
 * @function
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 */

const emailVerify = async (req, res) => {
  let { token } = req.params;
  if (!token) {
    return res.badRequest({
      message:
        "Insufficient request parameters! token are required.",
    });
  }
  let result = await ownerAuthService.emailVerify(
    token,
    model.User,
  );
  if (result.flag) {
    return res.badRequest({ message: result.data });
  }
  return res.success({
    message: "Email verified.",
    data: result.data,
  });
};

/**
 * Handles the complete signup.
 * @function
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 */

const completeSignUp = async (req, res) => {
  let {name, email, password} = req.body;
  if (!name || !email || !password) {
    return res.badRequest({
      message:
        "Insufficient request parameters! name, email and password are required.",
    });
  }
  var ip = req.socket.remoteAddress;
  let result = await ownerAuthService.completeSignUp(
    name,
    email,
    password,
    model.User,
    ip,
  );
  if (result.flag) {
    return res.badRequest({ message: result.data });
  }
  return res.success({
    message: "Signup complete successful.",
    data: result.data,
  });
};

/**
 * Handles the resed email.
 * @function
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 */

const resendEmail = async (req, res) => {
  let { email } = req.body;
  if (!email) {
    return res.badRequest({
      message:
        "Insufficient request parameters! email are required.",
    });
  }
  let result = await ownerAuthService.resendEmail(
    model.User,
    email,
    req.get("origin")
  );

  if (result.flag) {
    return res.badRequest({ message: result.data });
  }
  return res.success({
    message: "Email resent successfully.",
  });
};

/**
 * Handles the forgot password.
 * @function
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 */

const forgotPassword = async (req, res) => {
  let { email } = req.body;
  if (!email) {
    return res.badRequest({
      message:
        "Insufficient request parameters! email are required.",
    });
  }
  const origin = req.get("origin") || req.get("host")
  let result = await ownerAuthService.forgotPassword(
    email,
    model.User,
    origin,
  );

  if (result.flag) {
    return res.badRequest({ message: result.data });
  }
  return res.success({
    message: "Forgot password email sent successfully.",
  });
};

/**
 * Handles the forgot email verify of a user.
 * @function
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 */

const forgotEmailVerify = async (req, res) => {
  let { token } = req.params;
  if (!token) {
    return res.badRequest({
      message:
        "Insufficient request parameters! token are required.",
    });
  }
  let result = await ownerAuthService.forgotEmailVerify(
    token,
    model.User,
  );
  if (result.flag) {
    return res.badRequest({ message: result.data });
  }
  return res.success({
    message: "Forgot password email verified.",
    data: result.data,
  });
};

/**
 * Handles the reset password.
 * @function
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 */

const resetPassword = async (req, res) => {
  let { newPassword, email } = req.body;
  if (!newPassword || !email) {
    return res.badRequest({
      message:
        "Insufficient request parameters! newPassword and email are required.",
    });
  }
  let result = await ownerAuthService.resetPassword(
    email,
    newPassword,
    model.User,
  );

  if (result.flag) {
    return res.badRequest({ message: result.data });
  }
  return res.success({
    message: "Password reset successfully.",
  });
};

module.exports = {
  ownerLogin,
  signUp,
  emailVerify,
  completeSignUp,
  resendEmail,
  forgotPassword,
  forgotEmailVerify,
  resetPassword
};
