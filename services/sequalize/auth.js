/**
 * auth.js
 * @description :: service functions used in authentication
 */

const { JWT, FORGOT_PASSWORD_WITH, ENVIROMENT } = require('../../constants/authConstant');
const model = require('../../model/sequalize');
const sqlService = require('../../utils/sqlService');
const emailService = require('./email');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dayjs = require('dayjs');
const uuid = require('uuid').v4;
const { Op } = require('sequelize');

/**
 * @description: service to generate JWT token for authentication.
 * @param {Object} user - User object.
 * @param {string} secret - JWT secret.
 * @returns {string} - JWT token.
 */
const generateToken = async (user, secret) => {
    return jwt.sign({
        id: user.id,
        username: user.username
    }, secret, { expiresIn: JWT.EXPIRES_IN * 60 });
};

/**
 * @description: service for user login.
 * @param {string} username - User's username.
 * @param {string} password - User's password.
 * @param {string} modelName - Model name for user data.
 * @param {string[]} attributes - Attributes to select.
 * @param {string} ip - User's IP address.
 * @param {string} platformName - Platform name.
 * @returns {Object} - Authentication status: { flag, data }.
 */
const login = async (username, password, modelName, attributes, ip, platformName) => {
    try {
        let where;
        if (platformName !== '') {
            where = { loginUsername: username };
        } else {
            where = { username: username };
        }

        const user = await sqlService.findOneSelected(modelName, where, attributes);

        if (!user) {
            return {
                flag: true,
                data: 'User not exists'
            };
        }

        const userData = user.toJSON();

        if (ip !== '') {
            if (userData.roleName !== null) {
                let text = userData.roleName;
                let result = text.match(platformName);
                if (!result) {
                    return { flag: true, data: `You have no access ${platformName} panel` };
                }

                const roleData = await sqlService.findOne(model.adminUserRoles, { roleName: result });
                if (!roleData) {
                    return { flag: true, data: 'Role not exists' };
                }
                if (roleData.isActive === 0) {
                    return { flag: true, data: 'This panel is blocked by Admin, please contact Admin.' };
                }

                userData.userRole = platformName;
            }

            const updateData = {
                currentLoginIP: ip.split('::ffff:')[1],
                lastLoginIP: userData.currentLoginIP || ip.split('::ffff:')[1],
                lastLoginDate: new Date()
            };

            const updatedUser = sqlService.update(modelName, { id: userData.id }, updateData);

            if (!updatedUser) {
                return {
                    flag: true,
                    data: 'Data could not be updated due to an error. Please try again.'
                };
            }

            if (userData.isActive === 0) {
                return {
                    flag: true,
                    data: 'You are blocked by Admin, please contact Admin.'
                };
            }

            if (userData.isTermination !== undefined && userData.isTermination === 1) {
                return {
                    flag: true,
                    data: 'You are blocked and terminated by Admin, please contact Admin.'
                };
            }

            if (password) {
                const isPasswordMatched = await bcrypt.compare(password, user.password);
                if (!isPasswordMatched) {
                    return {
                        flag: true,
                        data: 'Incorrect Password'
                    };
                }
            }
        } else {
            if (password) {
                const isPasswordMatched = await user.isPasswordMatch(password);
                if (!isPasswordMatched) {
                    return {
                        flag: true,
                        data: 'Incorrect Password'
                    };
                }
            }
        }

        let token = await generateToken(userData, JWT.CLIENT_SECRET);
        let expire = dayjs().add(JWT.EXPIRES_IN, 'second').toISOString();

        await sqlService.createOne(model.userTokens, {
            userId: userData.id,
            token: token,
            tokenExpiredTime: expire
        });

        let currentSessionData = await FUNC.getCurrentSession();
        let userToReturn = {
            ...userData,
            token,
            currentSessionData
        };

        return {
            flag: false,
            data: userToReturn
        };

    } catch (error) {
        throw new Error(error.message);
    }
};

/**
 * @description: service for forgotUser.
 * @param {string} modelName - Model name for user data.
 * @param {Object} getWhere - Where condition.
 * @param {string} getViewType - View type.
 * @param {string[]} attributes - Attributes to select.
 * @param {string} platformName - Platform name.
 * @returns {Object} - Authentication status: { flag, data }.
 */
const forgotUser = async (modelName, getWhere, getViewType, attributes, platformName) => {
    try {
        let token = uuid();
        let expires = dayjs().add(FORGOT_PASSWORD_WITH.EXPIRE_TIME, 'minute').toISOString();
        let where = getWhere;
        const user = await sqlService.findOneSelected(modelName, where, attributes);

        if (!user) {
            return {
                flag: true,
                data: 'Email not exists'
            };
        } else {
            const userData = user.toJSON();

            if (userData.roleName !== null) {
                let text = userData.roleName;
                let result = text.match(platformName);
                if (!result) {
                    return { flag: true, data: 'User Not found' };
                }

                const roleData = await sqlService.findOne(model.adminUserRoles, { roleName: result });

                if (!roleData) {
                    return { flag: true, data: 'Role not exists' };
                }

                if (roleData.isActive === 0) {
                    return { flag: true, data: 'Role not active' };
                }

                if (userData.isActive === 0) {
                    return {
                        flag: true,
                        data: 'You are blocked by Admin, please contact Admin.'
                    };
                }
            }

            let updateData = {
                recoveryCode: token,
                linkExpiryTime: expires,
                linkStatus: 0
            };
            await sqlService.update(modelName, where, updateData);

            let viewType = getViewType;
            let mailObj = {
                subject: 'Reset Password',
                to: userData.email,
                template: '/views/email/ResetPassword',
                data: {
                    userName: user.username || '-',
                    link: `${process.env.BASE_URL + (process.env.NODE_ENV == ENVIROMENT.prod ? "" : ":" + process.env.PORT)}` + viewType + token,
                    linkText: 'Reset Password',
                    url: ''
                }
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
 * @param {string} modelName - Model name for user data.
 * @param {string[]} attributes - Attributes to select.
 * @returns {Object} - User data.
 */
const createPassword = async (recovery_code, modelName, attributes) => {
    try {
        let where = {
            recoveryCode: recovery_code,
            isActive: true,
            isDeleted: false
        };
        const user = await sqlService.findOneSelected(modelName, where, attributes);

        if (!user) {
            return {
                flag: true,
                data: 'Invalid Link'
            };
        }

        let userAuth = await sqlService.findOne(modelName, where);

        if (userAuth && userAuth.linkExpiryTime) {
            if (dayjs(new Date()).isAfter(dayjs(userAuth.linkExpiryTime))) {
                return {
                    flag: true,
                    data: 'Your reset password link is expired or invalid'
                };
            }
        }

        const userData = user.toJSON();

        return {
            flag: false,
            data: userData
        };
    } catch (error) {
        throw new Error(error.message);
    }
};

/**
 * @description: service for submitPassword.
 * @param {string} password - Password.
 * @param {Object} getWhere - Where condition.
 * @param {string} modelName - Model name for user data.
 * @returns {Object} - Password update status: { flag, data }.
 */
const submitPassword = async (password, getWhere, modelName) => {
    try {
        let where = getWhere;
        where.isActive = true;
        where.isDeleted = false;
        const user = await sqlService.findOne(modelName, where);

        if (!user) {
            return {
                flag: true,
                data: 'User not exists'
            };
        }

        const userData = user.toJSON();
        let linkStatus = userData.linkStatus;

        if (linkStatus === 1) {
            return {
                flag: true,
                data: 'You have already updated your password'
            };
        }

        if (userData.userRole !== null && userData.userRole === 'SUPER_ADMIN') {
            password = await bcrypt.hash(password, 8);
        } else {
            password = common.passwordConvert(password, 'encrypt');
        }

        let updatedUser = sqlService.update(modelName, where, { password, linkStatus: 1, recoveryCode: common.randomString(60) });

        if (!updatedUser) {
            return {
                flag: true,
                data: 'Password could not be changed due to an error. Please try again'
            };
        }

        return {
            flag: false,
            data: []
        };
    } catch (error) {
        throw new Error(error.message);
    }
};

/**
 * @description: service for checking the old password.
 * @param {string} password - Old password.
 * @param {string} id - User's ID.
 * @param {string} modelName - Model name for user data.
 * @returns {Object} - Password check status: { flag, data }.
 */
const checkPassword = async (password, id, modelName) => {
    try {
        let where = { id: id, isActive: true, isDeleted: false };
        const userData = await sqlService.findOne(modelName, where);

        if (!userData) {
            return {
                flag: true,
                data: 'User not exists'
            };
        }

        if (userData.name !== null) {
            if (userData.userRole === 'SUPER_ADMIN') {
                const isPasswordMatched = await bcrypt.compare(password, userData.password);

                if (!isPasswordMatched) {
                    return {
                        flag: true,
                        data: 'Incorrect Old Password'
                    };
                }
            } else {
                const decryptPassword = common.passwordConvert(userData.password, 'decrypt');

                if (decryptPassword !== password) {
                    return {
                        flag: true,
                        data: 'Incorrect Old Password'
                    };
                }
            }
        } else {
            const decryptPassword = common.passwordConvert(userData.password, 'decrypt');

            if (decryptPassword !== password) {
                return {
                    flag: true,
                    data: 'Incorrect Old Password'
                };
            }
        }

        return {
            flag: false,
            data: []
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
 * @param {string} modelName - Model name for user data.
 * @returns {Object} - Password change status: { flag, data }.
 */
const changePassword = async (password, id, oldPassword, modelName) => {
    try {
        let where = { id: id, isActive: true, isDeleted: false };
        const user = await sqlService.findOne(modelName, where);

        if (!user) {
            return {
                flag: true,
                data: 'User not exists'
            };
        }

        var checkPass = await common.passwordCheck(password);
        password = password.replaceAll(/ /g, '');

        if (checkPass === true) {
            if (user.name !== null) {
                const isPasswordMatched = await bcrypt.compare(oldPassword, user.password);

                if (!isPasswordMatched) {
                    return {
                        flag: true,
                        data: 'Incorrect Old Password'
                    };
                }

                password = await bcrypt.hash(password, 8);
            } else {
                const decryptPassword = common.passwordConvert(user.password, 'decrypt');

                if (decryptPassword !== oldPassword) {
                    return {
                        flag: true,
                        data: 'Incorrect Old Password'
                    };
                }

                password = common.passwordConvert(password, 'encrypt');
            }

            let updatedUser = sqlService.update(modelName, where, { password });

            if (!updatedUser) {
                return {
                    flag: true,
                    data: 'Password could not be changed due to an error. Please try again'
                };
            }
        } else {
            return {
                flag: true,
                data: checkPass
            };
        }

        return {
            flag: false,
            data: []
        };
    } catch (error) {
        throw new Error(error.message);
    }
};

/**
 * @description: service for schoolForgotPassword.
 * @param {string} email - User's email.
 * @returns {Object} - Password reset status: { flag, data }.
 */
const schoolForgotPassword = async (email) => {
    try {
        let token = uuid();
        let expires = dayjs().add(FORGOT_PASSWORD_WITH.EXPIRE_TIME, 'minute').toISOString();
        let where = { passwordReCoveryEmail: email.toString().toLowerCase() };
        const userCheck = await sqlService.findOne(model.generalSetting, where);

        if (!userCheck) {
            return {
                flag: true,
                data: 'Email not exists'
            };
        } else {
            const userCheckData = userCheck.toJSON();
            const user = await sqlService.findOne(model.adminUser);
            const userData = user.toJSON();

            if (userData.isActive === 0) {
                return {
                    flag: true,
                    data: 'You are blocked by Admin, please contact Admin.'
                };
            }

            let updateData = {
                recoveryCode: token,
                linkExpiryTime: expires,
                linkStatus: 0
            };
            await sqlService.update(model.adminUser, { id: { [Op.ne]: '' } }, updateData);

            let viewType = '/school-admin/create-password/';
            let mailObj = {
                subject: 'Reset Password',
                to: userCheckData.passwordReCoveryEmail,
                template: '/views/email/ResetPassword',
                data: {
                    userName: user.username || '-',
                    link: `${process.env.BASE_URL + (process.env.NODE_ENV == ENVIROMENT.prod ? '' : ':' + process.env.PORT)}` + viewType + token,
                    linkText: 'Reset Password',
                    url: ''
                }
            };

            try {
                await emailService.sendSesEmail(mailObj);
                return {
                    flag: false
                };
            } catch (error) {
                throw new Error(error.message);
            }
        }
    } catch (error) {
        throw new Error(error.message);
    }
};

/**
 * @description: service for forgotPassword.
 * @param {string} modelName - Model name for user data.
 * @param {Object} where - Where condition.
 * @param {string} getViewType - View type.
 * @param {string[]} attributes - Attributes to select.
 * @returns {Object} - Password reset status: { flag, data }.
 */
const forgotPassword = async (modelName, where, getViewType, attributes) => {
    try {
        let token = uuid();
        let expires = dayjs().add(FORGOT_PASSWORD_WITH.EXPIRE_TIME, 'minute').toISOString();
        const userCheck = await sqlService.findOneSelected(modelName, where, attributes);

        if (!userCheck) {
            return {
                flag: true,
                data: 'Email not exists'
            };
        } else {
            const userData = userCheck.toJSON();

            if (userData.isActive === 0) {
                return {
                    flag: true,
                    data: 'You are blocked by Admin, please contact Admin.'
                };
            }

            let updateData = {
                recoveryCode: token,
                linkExpiryTime: expires,
                linkStatus: 0
            };
            await sqlService.update(modelName, where, updateData);

            let viewType = getViewType;
            let mailObj = {
                subject: 'Reset Password',
                to: userData.email,
                template: '/views/email/ResetPassword',
                data: {
                    userName: userData.username || '-',
                    link: `${process.env.BASE_URL + (process.env.NODE_ENV == ENVIROMENT.prod ? '' : ':' + process.env.PORT)}` + viewType + token,
                    linkText: 'Reset Password',
                    url: ''
                }
            };

            try {
                await emailService.sendSesEmail(mailObj);
                return {
                    flag: false
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
    schoolForgotPassword,
    forgotPassword
};
