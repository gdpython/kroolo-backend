/**
 * auth.js
 * @description :: service functions used in authentication
 */

const {
  JWT,
  ENVIRONMENT,
  COGNITO_CLIENT,
  COGNITO_PASSWORD_AUTH,
  ADMIN_USER_PASSWORD_AUTH,
} = require("../../constants/authConstant");
const {
  EMAIL_VERIFY,
  EMAIL_FORGOT_PASSWORD,
} = require("../../constants/emailConstants");
const {
  InitiateAuthCommand,
  AdminCreateUserCommand,
  AdminUpdateUserAttributesCommand,
  AdminSetUserPasswordCommand,
  ChangePasswordCommand,
  ForgotPasswordCommand,
} = require("@aws-sdk/client-cognito-identity-provider"); // CommonJS import
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dayjs = require("dayjs");
const uuid = require("uuid").v4;
const model = require("../../model/mongoose");
const {
  createOne,
  findOne,
  updateOne,
} = require("../../utils/mongooseService");
const { generatePassword } = require("../../utils/common");
const { sendMail } = require("../email");
const { crypto } = require("../../helpers/function");
const { ENC_TYPE } = require("../../constants/appConstants");
const { COGNITO_STATUS } = require("../../constants/schemaConstants");

/**
 * @description: service to generate JWT token for authentication.
 * @param {Object} user - User object.
 * @param {string} secret - JWT secret.
 * @returns {string} - JWT token.
 */
const generateToken = async (user, secret) => {
  return jwt.sign(
    {
      id: user._id,
      username: user.username,
    },
    secret,
    { expiresIn: JWT.EXPIRES_IN * 60 }
  );
};

/**
 * @description: service for user login.
 * @param {string} username - User's username.
 * @param {string} password - User's password.
 * @param {string} modelName - Model name for user data (Mongoose model).
 * @param {string} ip - User's IP address.
 * @returns {Object} - Authentication status: { flag, data }.
 */
const login = async (username, password, modelName, ip) => {
  try {
    const query = { username: username };
    const user = await findOne(modelName, query);
    if (!user) {
      return {
        flag: true,
        data: "User not exists",
      };
    }
    const userData = user.toObject();
    if (!userData.isActive) {
      return {
        flag: true,
        data: "You are blocked by Admin, please contact Admin.",
      };
    }
    const input = {
      AuthFlow: COGNITO_PASSWORD_AUTH,
      ClientId: process.env.COGNITO_APP_CLIENT_ID,
      AuthParameters: {
        USERNAME: username,
        PASSWORD: password,
      },
    };
    const command = new InitiateAuthCommand(input);
    const response = await COGNITO_CLIENT.send(command);
    if (response.AuthenticationResult) {
      const { AccessToken, ExpiresIn, IdToken, RefreshToken, TokenType } =
        response.AuthenticationResult;

      const updateData = {
        currentLoginIP: ip.split("::ffff:")[1],
        lastLoginIP: userData.currentLoginIP || ip.split("::ffff:")[1],
        lastLoginDate: new Date(),
      };
      await updateOne(modelName, { _id: userData._id }, updateData);
      const orgnaization = await findOne(model.Organizations, {
        _id: userData._id,
      });
      let accessToken = await generateToken(
        { organizationID: orgnaization._id, cognitoAccessToken: AccessToken },
        JWT.CLIENT_SECRET
      );
      let refershToken = await generateToken(
        { organizationID: orgnaization._id, cognitoRefreshToken: RefreshToken },
        JWT.CLIENT_SECRET
      );
      let expireJWT = dayjs().add(JWT.EXPIRES_IN, "second").toISOString();

      createUserToken(model.UserToken, {
        userID: user._id,
        token: `${TokenType} ${refershToken}`,
        cognitoTokeExpiredTime: ExpiresIn,
        jwtTokeExpiredTime: expireJWT,
      });
      let userToReturn = {
        ...userData,
        refershToken,
        accessToken,
      };

      return {
        flag: false,
        data: userToReturn,
      };
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

/**
 * @description: service for user SignUp.
 * @param {string} req - User's signup request for origin.
 * @param {string} email - User's email.
 * @param {string} modelName - Model name for user data (Mongoose model).
 * @param {string} ip - User's IP address.
 * @returns {Object} - Authentication status: { flag, data }.
 */

const signUp = async (req, email, modelName, ip) => {
  try {
    const query = { username: email };
    const user = await findOne(modelName, query);
    if (user) {
      return {
        flag: true,
        data: "User already exists",
      };
    }
    let token = uuid();
    let expires = dayjs().add(EMAIL_VERIFY.EXPIRE_TIME, "minute").toISOString();

    const password = generatePassword(20);
    const input = {
      UserPoolId: process.env.COGNITO_USER_POOL_ID,
      Username: email,
      DesiredDeliveryMediums: ["EMAIL"],
      TemporaryPassword: password,
      MessageAction: "SUPPRESS",
      UserAttributes: [
        {
          Name: "email",
          Value: email,
        },
      ],
    };
    const command = new AdminCreateUserCommand(input);
    const response = await COGNITO_CLIENT.send(command);
    if (response.User) {
      const createdUser = await createOne(modelName, {
        ...query,
        email,
        password,
        cogintoStatus: response.User.UserStatus,
      });
      let updateData = {
        emailVerifyCode: token,
        emailVerifyExpiryTime: expires,
      };
      await updateOne(modelName, { _id: createdUser._id }, updateData);
      let mailObj = {
        subject: EMAIL_VERIFY.SUBJECT,
        to: email,
        template: "/views/email/EmailVerification.ejs",
        data: {
          link: `${req}/verifyLink/` + token,
        },
      };
      const isEmailSend = await sendMail(mailObj);
      if (isEmailSend) {
        return {
          flag: false,
          data: createdUser,
        };
      } else {
        return {
          flag: true,
          data: createdUser,
        };
      }
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

/**
 * @description: service for user email verify.
 * @param {string} token - User's token.
 * @param {string} modelName - Model name for user data (Mongoose model).
 * @returns {Object} - Authentication status: { flag, data }.
 */

const emailVerify = async (token, modelName) => {
  try {
    const query = { emailVerifyCode: token };
    const user = await findOne(modelName, query);
    if (!user) {
      return {
        flag: true,
        data: "Invalid Link",
      };
    }
    const userData = user.toObject();
    if (userData.emailVerifyExpiryTime) {
      if (
        dayjs(new Date()).isAfter(dayjs(userData.emailVerifyExpiryTime)) &&
        userData.emailVerfiyStatus === false
      ) {
        return {
          flag: true,
          data: "Your email verification link is expired or invalid",
        };
      }
    }
    const input = {
      UserPoolId: process.env.COGNITO_USER_POOL_ID,
      Username: user.email,
      UserAttributes: [
        {
          Name: "email_verified",
          Value: "true",
        },
      ],
    };
    const command = new AdminUpdateUserAttributesCommand(input);
    const response = await COGNITO_CLIENT.send(command);
    if (response) {
      const updateData = {
        emailVerfiyStatus: true,
        cogintoStatus: COGNITO_STATUS[1],
      };
      await updateOne(modelName, { _id: userData._id }, updateData);
      return {
        flag: false,
        data: user.email,
      };
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

/**
 * @description: service for user complete signup.
 * @param {string} name - User's name.
 * @param {string} email - User's email.
 * @param {string} password - User's new password.
 * @param {string} modelName - Model name for user data (Mongoose model).
 * @param {string} ip - User's IP address.
 * @returns {Object} - Authentication status: { flag, data }.
 */

const completeSignUp = async (name, email, password, modelName, ip) => {
  try {
    const query = { email: email };
    const user = await findOne(modelName, query);
    if (!user) {
      return {
        flag: true,
        data: "User not exists",
      };
    }
    const userData = user.toObject();
    if (userData.emailVerfiyStatus === false && userData.cogintoStatus !== COGNITO_STATUS[1]) {
      return {
        flag: true,
        data: "Please verify your email first",
      };
    }

    const input = {
      UserPoolId: process.env.COGNITO_USER_POOL_ID,
      Username: user.email,
      UserAttributes: [
        {
          Name: "name",
          Value: name,
        },
      ],
    };
    const command = new AdminUpdateUserAttributesCommand(input);
    const cognitoNameChange = await COGNITO_CLIENT.send(command);

    const changePasswordInput = {
      UserPoolId: process.env.COGNITO_USER_POOL_ID,
      Username: email,
      Password: password,
      Permanent: true,
    };
    const commandPasswordChange = new AdminSetUserPasswordCommand(
      changePasswordInput
    );
    const response = await COGNITO_CLIENT.send(commandPasswordChange);
    const updateData = {
      fullName: name,
      password: crypto(password, ENC_TYPE[0]),
      emailVerifyCode: "",
      emailVerifyExpiryTime: "",
      emailVerfiyStatus: false,
    };
    await updateOne(modelName, { _id: userData._id }, updateData);
    // const loginUserData = await login(email, password, modelName, ip);
    // console.log(loginUserData, "loginUserData");
    // return {
    //   flag: false,
    //   data: loginUserData,
    // };
  } catch (error) {
    throw new Error(error.message);
  }
};

/**
 * @description: service for resend email.
 * @param {string} modelName - Model name for user data (Mongoose model).
 * @param {string} email - user email.
 * @param {string} req - request origin url.
 * @returns {Object} - Authentication status: { flag, data }.
 */

const resendEmail = async (modelName, email, req) => {
  try {
    const query = { email: email };
    const user = await findOne(modelName, query);
    if (!user) {
      return {
        flag: true,
        data: "User not exists",
      };
    }
    const userData = user.toObject();
    if (userData.emailVerfiyStatus === true) {
      return {
        flag: true,
        data: "Email already verified",
      };
    }
    let token = uuid();
    let expires = dayjs().add(EMAIL_VERIFY.EXPIRE_TIME, "minute").toISOString();
    let updateData = {
      emailVerifyCode: token,
      emailVerifyExpiryTime: expires,
    };
    await updateOne(modelName, { _id: userData._id }, updateData);
    let mailObj = {
      subject: EMAIL_VERIFY.SUBJECT,
      to: email,
      template: "/views/email/EmailVerification.ejs",
      data: {
        link: `${req}/verifyLink/` + token,
      },
    };
    const isEmailSend = await sendMail(mailObj);
    if (isEmailSend) {
      return {
        flag: false,
        data: "Email sent successfully",
      };
    } else {
      return {
        flag: true,
        data: "Email not sent",
      };
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

/**
 * @description: service for changing the password.
 * @param {string} id - User's ID.
 * @param {string} token - User's token.
 * @param {string} newPassword - New password.
 * @param {string} oldPassword - Old password.
 * @param {string} modelName - Mongoose model for user data.
 * @returns {Object} - Password change status: { flag, data }.
 */
const changePassword = async (
  id,
  token,
  oldPassword,
  newPassword,
  modelName
) => {
  try {
    const user = await modelName.findOne({
      _id: id,
      isActive: true,
      isDeleted: false,
    });

    if (!user) {
      return {
        flag: true,
        data: "User not exists",
      };
    }

    var input = {
      AccessToken: token /* required */,
      PreviousPassword: oldPassword /* required */,
      ProposedPassword: newPassword /* required */,
    };

    const command = new ChangePasswordCommand(input);
    const response = await client.send(command);
    if (response) {
      const updateData = {
        password: crypto(newPassword, ENC_TYPE[0]),
      };
      await updateOne(modelName, { _id: id }, updateData);
    } else {
      return {
        flag: true,
        data: "Password could not be changed due to an error. Please try again",
      };
    }

    return {
      flag: false,
      data: [],
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

/**
 * @description: service for forgotPassword.
 * @param {string} email - user's email.
 * @param {Model} modelName - Mongoose model for user data.
 * @param {string} req - request origin url.
 * @returns {Object} - Password reset status: { flag, data }.
 */
const forgotPassword = async (email, modelName, req) => {
  try {
    let query = { email: email };
    const userCheck = await modelName.findOne(query);
    if (!userCheck) {
      return {
        flag: true,
        data: "Email not exists",
      };
    }
    const userData = userCheck.toObject();
    if (userData.isActive === 0) {
      return {
        flag: true,
        data: "You are blocked by Admin, please contact Admin.",
      };
    }
    if (userData.cogintoStatus !== COGNITO_STATUS[1]) {
      return {
        flag: true,
        data: "Please verify your email first",
      };
    }

    const input = {
      ClientId: process.env.COGNITO_APP_CLIENT_ID,
      Username: email,
    };

    const command = new ForgotPasswordCommand(input);
    const response = await COGNITO_CLIENT.send(command);
    if (response) {
      let token = uuid();
      let expires = dayjs()
        .add(EMAIL_FORGOT_PASSWORD.EXPIRE_TIME, "minute")
        .toISOString();

      let updateData = {
        emailVerifyCode: token,
        emailVerifyExpiryTime: expires,
        emailVerfiyStatus: false,
      };
      await updateOne(modelName, query, updateData);

      let mailObj = {
        subject: EMAIL_FORGOT_PASSWORD.SUBJECT,
        to: email,
        template: "/views/email/ForgetPassword.ejs",
        data: {
          link: `${req}/resetPassword/` + token,
        },
      };

      const isEmailSend = await sendMail(mailObj);
      if (isEmailSend) {
        return {
          flag: false,
          data: "Email sent successfully",
        };
      } else {
        return {
          flag: true,
          data: "Email not sent",
        };
      }
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

/**
 * @description: service for reset password.
 * @param {Object} email - User's email.
 * @param {string} newPassword - User's new passsword.
 * @param {string} modelName - Model name for user data (Mongoose model).
 * @returns {Object} - Authentication status: { flag, data }.
 */

const resetPassword = async (email, newPassword, modelName) => {
  try {
    const user = await modelName.findOne({
      email: email,
      isActive: true,
      isDeleted: false,
    });

    if (!user) {
      return {
        flag: true,
        data: "User not exists",
      };
    }

    const userData = user.toObject();

    if (userData.emailVerifyExpiryTime) {
      if (dayjs(new Date()).isAfter(dayjs(userData.emailVerifyExpiryTime))) {
        return {
          flag: true,
          data: "Your reset password link is expired or invalid",
        };
      }
    }

    const input = {
      UserPoolId: process.env.COGNITO_USER_POOL_ID,
      Username: email,
      Password: newPassword,
      Permanent: true,
    };

    const command = new AdminSetUserPasswordCommand(input);
    const response = await COGNITO_CLIENT.send(command);
    if (response) {
      const updateData = {
        password: crypto(newPassword, ENC_TYPE[0]),
        emailVerifyCode: "",
        emailVerifyExpiryTime: "",
        emailVerfiyStatus: false,
      };
      await updateOne(modelName, { _id: userData._id }, updateData);
    } else {
      return {
        flag: true,
        data: "Password could not be changed due to an error. Please try again",
      };
    }

    return {
      flag: false,
      data: [],
    };
  } catch (error) {
    throw new Error(error.message);
  }
}

/**
 * @description: service for createUserToken.
 * @param {string} modelName - Model name for user data (Mongoose model).
 * @param {Object} user - Login user object.
 * @param {string} token - Refresh token with Bearer.
 * @param {string} expire - Access token expire date time.
 * @returns {Object} - Authentication status: { flag, data }.
 */

const createUserToken = async (modelName, ...data) => {
  const createdUserToken = await createOne(modelName, data);
  if (!createdUserToken) {
    return {
      flag: true,
      data: "User token not created",
    };
  }
  const userTokenData = createdUserToken.toObject();
  return {
    flag: false,
    data: userTokenData,
  };
};


module.exports = {
  login,
  signUp,
  emailVerify,
  completeSignUp,
  resendEmail,
  resetPassword,
  changePassword,
  forgotPassword,
};
