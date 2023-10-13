/**
 * auth.js
 * @description :: service functions used in authentication
 */

const {
  JWT,
  FORGOT_PASSWORD_WITH,
  ENVIRONMENT,
  COGNITO_CLIENT,
  COGNITO_PASSWORD_AUTH,
} = require("../../constants/authConstant");
const {
  InitiateAuthCommand,
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
 * @param {string[]} attributes - Attributes to select.
 * @param {string} ip - User's IP address.
 * @param {string} platformName - Platform name.
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
      const orgnaization = await findOne(model.Organizations, {_id:userData._id});
      let accessToken = await generateToken({orgId:orgnaization._id,cognitoToken: AccessToken}, JWT.CLIENT_SECRET);
      let refershToken = await generateToken({orgId:orgnaization._id,cognitoToken: RefreshToken}, JWT.CLIENT_SECRET);
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
 * @description: service for createUserToken.
 * @param {string} modelName - Model name for user data (Mongoose model).
 * @param {Object} user - Login user object.
 * @param {string} token - Refresh token with Bearer.
 * @param {string} expire - Access token expire date time.
 * @returns {Object} - Authentication status: { flag, data }.
 */

const createUserToken = async (modelName, ...data) => {
  const createdUserToken = await createOne(modelName, data);
  console.log(createdUserToken, "userTokenData");
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

/**
 * @description: service for forgotUser.
 * @param {string} modelName - Model name for user data (Mongoose model).
 * @param {Object} getWhere - Where condition.
 * @param {string} getViewType - View type.
 * @param {string[]} attributes - Attributes to select.
 * @param {string} platformName - Platform name.
 * @returns {Object} - Authentication status: { flag, data }.
 */
const forgotUser = async (
  modelName,
  getWhere,
  getViewType,
  attributes,
  platformName
) => {
  try {
    let token = uuid();
    let expires = dayjs()
      .add(FORGOT_PASSWORD_WITH.EXPIRE_TIME, "minute")
      .toISOString();
    let where = getWhere;
    const user = await modelName.findOne(where).select(attributes.join(" "));

    if (!user) {
      return {
        flag: true,
        data: "Email not exists",
      };
    } else {
      const userData = user.toObject();

      if (userData.roleName !== null) {
        let text = userData.roleName;
        let result = text.match(platformName);
        if (!result) {
          return { flag: true, data: "User Not found" };
        }

        const roleData = await model.adminUserRoles.findOne({
          roleName: result,
        });

        if (!roleData) {
          return { flag: true, data: "Role not exists" };
        }

        if (roleData.isActive === 0) {
          return { flag: true, data: "Role not active" };
        }

        if (userData.isActive === 0) {
          return {
            flag: true,
            data: "You are blocked by Admin, please contact Admin.",
          };
        }
      }

      let updateData = {
        recoveryCode: token,
        linkExpiryTime: expires,
        linkStatus: 0,
      };
      await modelName.updateOne(where, updateData);

      let viewType = getViewType;
      let mailObj = {
        subject: "Reset Password",
        to: userData.email,
        template: "/views/email/ResetPassword",
        data: {
          userName: userData.username || "-",
          link:
            `${
              process.env.BASE_URL +
              (process.env.NODE_ENV == ENVIRONMENT.prod
                ? ""
                : ":" + process.env.PORT)
            }` +
            viewType +
            token,
          linkText: "Reset Password",
          url: "",
        },
      };

      try {
        await emailService.sendSesEmail(mailObj);
        return true;
      } catch (error) {
        throw new Error(error.message);
      }
    }
  } catch (error) {
    throw new Error(error.message);
  }
};
/**
 * @description: service for createPassword.
 * @param {string} recovery_code - Recovery code.
 * @param {string} modelName - Model name for user data (Mongoose model).
 * @param {string[]} attributes - Attributes to select.
 * @returns {Object} - User data.
 */
const createPassword = async (recovery_code, modelName, attributes) => {
  try {
    let where = {
      recoveryCode: recovery_code,
      isActive: true,
      isDeleted: false,
    };
    const user = await modelName.findOne(where).select(attributes.join(" "));

    if (!user) {
      return {
        flag: true,
        data: "Invalid Link",
      };
    }

    let userAuth = await modelName.findOne(where);

    if (userAuth && userAuth.linkExpiryTime) {
      if (dayjs(new Date()).isAfter(dayjs(userAuth.linkExpiryTime))) {
        return {
          flag: true,
          data: "Your reset password link is expired or invalid",
        };
      }
    }

    const userData = user.toObject();

    return {
      flag: false,
      data: userData,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};
/**
 * @description: service for submitPassword.
 * @param {string} password - Password.
 * @param {Object} getWhere - Where condition.
 * @param {string} modelName - Model name for user data (Mongoose model).
 * @returns {Object} - Password update status: { flag, data }.
 */
const submitPassword = async (password, getWhere, modelName) => {
  try {
    let where = getWhere;
    where.isActive = true;
    where.isDeleted = false;
    const user = await modelName.findOne(where);

    if (!user) {
      return {
        flag: true,
        data: "User not exists",
      };
    }

    const userData = user.toObject();
    let linkStatus = userData.linkStatus;

    if (linkStatus === 1) {
      return {
        flag: true,
        data: "You have already updated your password",
      };
    }

    if (userData.userRole !== null && userData.userRole === "SUPER_ADMIN") {
      password = await bcrypt.hash(password, 8);
    } else {
      password = common.passwordConvert(password, "encrypt");
    }

    let updatedUser = await modelName.updateOne(where, {
      password,
      linkStatus: 1,
      recoveryCode: common.randomString(60),
    });

    if (!updatedUser) {
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
 * @description: service for checking the old password.
 * @param {string} password - Old password.
 * @param {string} id - User's ID.
 * @param {Model} modelName - Mongoose model for user data.
 * @returns {Object} - Password check status: { flag, data }.
 */
const checkPassword = async (password, id, modelName) => {
  try {
    const userData = await modelName.findOne({
      _id: id,
      isActive: true,
      isDeleted: false,
    });

    if (!userData) {
      return {
        flag: true,
        data: "User not exists",
      };
    }

    if (userData.name !== null) {
      const isPasswordMatched = await bcrypt.compare(
        password,
        userData.password
      );

      if (!isPasswordMatched) {
        return {
          flag: true,
          data: "Incorrect Old Password",
        };
      }
    } else {
      const decryptPassword = common.passwordConvert(
        userData.password,
        "decrypt"
      );

      if (decryptPassword !== password) {
        return {
          flag: true,
          data: "Incorrect Old Password",
        };
      }
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
 * @description: service for changing the password.
 * @param {string} password - New password.
 * @param {string} oldPassword - Old password.
 * @param {string} id - User's ID.
 * @param {Model} modelName - Mongoose model for user data.
 * @returns {Object} - Password change status: { flag, data }.
 */
const changePassword = async (password, id, oldPassword, modelName) => {
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

    var checkPass = await common.passwordCheck(password);
    password = password.replaceAll(/ /g, "");

    if (checkPass === true) {
      if (user.name !== null) {
        const isPasswordMatched = await bcrypt.compare(
          oldPassword,
          user.password
        );

        if (!isPasswordMatched) {
          return {
            flag: true,
            data: "Incorrect Old Password",
          };
        }

        password = await bcrypt.hash(password, 8);
      } else {
        const decryptPassword = common.passwordConvert(
          user.password,
          "decrypt"
        );

        if (decryptPassword !== oldPassword) {
          return {
            flag: true,
            data: "Incorrect Old Password",
          };
        }

        password = common.passwordConvert(password, "encrypt");
      }

      const updatedUser = await modelName.updateOne({ _id: id }, { password });

      if (!updatedUser) {
        return {
          flag: true,
          data: "Password could not be changed due to an error. Please try again",
        };
      }
    } else {
      return {
        flag: true,
        data: checkPass,
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
 * @param {Model} modelName - Mongoose model for user data.
 * @param {Object} where - Where condition.
 * @param {string} getViewType - View type.
 * @param {string[]} attributes - Attributes to select.
 * @returns {Object} - Password reset status: { flag, data }.
 */
const forgotPassword = async (modelName, where, getViewType, attributes) => {
  try {
    let token = uuid();
    let expires = dayjs()
      .add(FORGOT_PASSWORD_WITH.EXPIRE_TIME, "minute")
      .toISOString();
    const userCheck = await modelName.findOne(where, attributes);

    if (!userCheck) {
      return {
        flag: true,
        data: "Email not exists",
      };
    } else {
      const userData = userCheck.toObject();

      if (userData.isActive === 0) {
        return {
          flag: true,
          data: "You are blocked by Admin, please contact Admin.",
        };
      }

      let updateData = {
        recoveryCode: token,
        linkExpiryTime: expires,
        linkStatus: 0,
      };
      await modelName.updateOne(where, updateData);

      let viewType = getViewType;
      let mailObj = {
        subject: "Reset Password",
        to: userData.email,
        template: "/views/email/ResetPassword",
        data: {
          userName: userData.username || "-",
          link:
            `${
              process.env.BASE_URL +
              (process.env.NODE_ENV == ENVIROMENT.prod
                ? ""
                : ":" + process.env.PORT)
            }` +
            viewType +
            token,
          linkText: "Reset Password",
          url: "",
        },
      };

      try {
        await emailService.sendSesEmail(mailObj);
        return {
          flag: false,
        };
      } catch (error) {
        throw new Error(error.message);
      }
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  login,
  forgotUser,
  createPassword,
  submitPassword,
  checkPassword,
  changePassword,
  forgotPassword,
};
