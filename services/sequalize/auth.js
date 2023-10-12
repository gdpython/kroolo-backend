/**
 * auth.js
 * @description :: service functions used in authentication
 */

const { JWT, FORGOT_PASSWORD_WITH, ENVIROMENT } = require('../../constants/authConstant');
var FUNC = require('../../helpers/function');
const model = require('../../model/sequalize');
const sqlService = require('../../utils/sqlService');
const common = require('../../utils/common');
const emailService = require('./email');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dayjs = require('dayjs');
const uuid = require('uuid').v4;
const { Op } = require('sequelize');


/**
 * @description : service to generate JWT token for authentication.
 * @param {obj} user : user who wants to login.
 * @param {string} secret : secret for JWT.
 * @return {string}  : returns JWT token.
 */
const generateToken = async (user, secret) => {
    return jwt.sign({
        id: user.id,
        'username': user.username
    }, secret, { expiresIn: JWT.EXPIRES_IN * 60 });
};

/**
 * @description : service of login user.
 * @param {string} username : username of user.
 * @param {string} password : password of user.
 * @param {string} platform : platform.
 * @param {boolean} roleAccess: a flag to request user`s role access
 * @return {obj} : returns authentication status. {flag, data}
 */
const login = async (username, password, modelName, attributes, ip, platformName) => {
    try {
        if (platformName != '') var where = { loginUsername: username };
        else var where = { username: username };
        const user = await sqlService.findOneSelected(modelName, where, attributes);
        if (!user) {
            return {
                flag: true,
                data: 'User not exists'
            };
        }
        const userData = user.toJSON();
        const { ...object } = userData
        if (ip != '') {
            if (userData.roleName != null) {
                let text = userData.roleName;
                let result = text.match(platformName);
                if (!result) return { flag: true, data: `You have no access ${platformName} panel ` };

                var roleData = await sqlService.findOne(model.adminUserRoles, { roleName: result })
                if (!roleData) return { flag: true, data: 'Role not exists' };
                if (roleData.isActive == 0) return { flag: true, data: 'This panel block by Admin, Please contact to Admin.' };

                object.userRole = platformName
            }

            var updateData = {}
            var ipAdd = ip.split('::ffff:')
            if (!userData.currentLoginIP) updateData = { currentLoginIP: ipAdd[1], lastLoginIP: ipAdd[1] }
            else updateData = { currentLoginIP: ipAdd[1], lastLoginIP: userData.currentLoginIP }
            updateData.lastLoginDate = new Date()

            let updatedUser = sqlService.update(modelName, { id: userData.id }, updateData);
            if (!updatedUser) {
                return {
                    flag: true,
                    data: 'data can not changed due to some error.please try again'
                };
            }
            if (userData.isActive == 0) {
                return {
                    flag: true,
                    data: 'You are blocked by Admin, Please contact to Admin.'
                };
            }
            if (userData.isTermination != undefined && userData.isTermination == 1) {
                return {
                    flag: true,
                    data: 'You are blocked & terminated by Admin, Please contact to Admin.'
                };
            }
            if (password) {
                var isPasswordMatched = common.passwordConvert(user.password, 'decrypt')
                if (password != isPasswordMatched) {
                    return {
                        flag: true,
                        data: 'Incorrect Password'
                    };
                }
            }
        } else {
            if (password) {
                let isPasswordMatched = await user.isPasswordMatch(password);
                if (!isPasswordMatched) {
                    /* await sqlService.update(model.userAuthSettings, { userId: user.id }, { loginRetryLimit: userAuth.loginRetryLimit + 1 }); */
                    return {
                        flag: true,
                        data: 'Incorrect Password'
                    };
                }
            }
        }
        let token;

        token = await generateToken(object, JWT.CLIENT_SECRET);
        let expire = dayjs().add(JWT.EXPIRES_IN, 'second').toISOString();
        console.log('expire', expire);
        await sqlService.createOne(model.userTokens, {
            userId: user.id,
            token: token,
            tokenExpiredTime: expire
        });
        let currentSessionData = await FUNC.getCurrentSession();
        let userToReturn = {
            ...object,
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
 * @description : service of forgotUser.
 * @param {string} modelName : modelName.
 * @param {string} getWhere : pass where condtion in object {}.
 * @param {string} getViewType : pass view type in string /school-admin/create-password/.
 */
const forgotUser = async (modelName, getWhere, getViewType, attributes, platformName) => {
    try {
        let token = uuid();
        let expires = dayjs();
        expires = expires.add(FORGOT_PASSWORD_WITH.EXPIRE_TIME, 'minute').toISOString();
        let where = getWhere
        const user = await sqlService.findOneSelected(modelName, where, attributes);
        if (!user) {
            return {
                flag: true,
                data: 'Email not exists'
            };
        } else {
            const userData = user.toJSON();

            if (user.roleName != null) {

                let text = user.roleName;
                let result = text.match(platformName);
                if (!result) return { flag: true, data: 'User Not found' };

                var roleData = await sqlService.findOne(model.adminUserRoles, { roleName: result })
                if (!roleData) return { flag: true, data: 'Role not exists' };
                if (roleData.isActive == 0) return { flag: true, data: 'Role not active' };

                if (userData.isActive == 0) {
                    return {
                        flag: true,
                        data: 'You are blocked by Admin, Please contact to Admin.'
                    };
                }
            }

            let updateData = {
                'recoveryCode': token,
                'linkExpiryTime': expires,
                'linkStatus': 0
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
 * @description : service of createPassword.
 * @param {string} modelName : modelName.
 * @param {string} recovery_code : pass recovery_code string.
 * @param {string} attributes : pass attributes in array ['id','email'].
 */
const createPassword = async (recovery_code, modelName, attributes) => {
    try {
        let where = { recoveryCode: recovery_code };
        where.isActive = true; where.isDeleted = false;
        const user = await sqlService.findOneSelected(modelName, where, attributes);
        if (!user) {
            return {
                flag: true,
                data: 'Invalid Link'
            };
        }
        let userAuth = await sqlService.findOne(modelName, where);
        if (userAuth && userAuth.linkExpiryTime) {
            if (dayjs(new Date()).isAfter(dayjs(userAuth.linkExpiryTime))) {// link expire        
                return {
                    flag: true,
                    data: 'Your reset password link is expired or invalid'
                };

                /* return res.failure({ message: 'Your reset password link is expired or invalid' }); */
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
 * @description : service of submitPassword.
 * @param {string} modelName : modelName.
 * @param {string} password : pass password.
 * @param {string} getWhere : pass where condtion in object {}.
 */
const submitPassword = async (password, getWhere, modelName) => {
    try {
        var randomString = common.randomString(60);
        let where = getWhere;
        where.isActive = true; where.isDeleted = false;
        const user = await sqlService.findOne(modelName, where);
        if (!user) {
            return {
                flag: true,
                data: 'User not exists'
            };
        }
        const userData = user.toJSON();
        let linkStatus = userData.linkStatus
        if (linkStatus == 1) {
            return {
                flag: true,
                data: 'You have already updated your password'
            };
        }
        if (userData.userRole != null && userData.userRole == 'SUPER_ADMIN') var pass = await bcrypt.hash(password, 8);
        else var pass = common.passwordConvert(password, 'encrypt')

        let updatedUser = sqlService.update(modelName, where, { password: pass, linkStatus: 1, recoveryCode: randomString });
        if (!updatedUser) {
            return {
                flag: true,
                data: 'password can not changed due to some error.please try again'
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
 * @description : service of checkPassword.
 * @param {string} modelName : modelName.
 * @param {string} password : pass password.
 * @param {string} id : pass id only for condtion match.
 */

const checkPassword = async (password, id, modelName) => {
    try {
        let where = { id: id };
        where.isActive = true; where.isDeleted = false;
        const userData = await sqlService.findOne(modelName, where);
        if (!userData) {
            return {
                flag: true,
                data: 'User not exists'
            };
        }
        if (userData.name != null) {
            if (userData.userRole == 'SUPER_ADMIN') {
                const isPasswordMatched = await userData.isPasswordMatch(password);
                if (!isPasswordMatched) {
                    return {
                        flag: true,
                        data: 'Incorrect Old Password'
                    };
                }
            } else {
                const decryptPassword = common.passwordConvert(userData.password, 'decrypt')
                if (decryptPassword !== password) {
                    return {
                        flag: true,
                        data: 'Incorrect Old Password'
                    };

                }
            }
        } else {
            const decryptPassword = common.passwordConvert(userData.password, 'decrypt')
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
 * @description : service of changePassword.
 * @param {string} modelName : modelName.
 * @param {string} password : pass password.
 * @param {string} oldPassword : pass oldPassword.
 * @param {string} id : pass id only for condtion match.
 */

const changePassword = async (password, id, oldPassword, modelName) => {
    try {
        let where = { id: id };
        where.isActive = true; where.isDeleted = false;
        const user = await sqlService.findOne(modelName, where);
        if (!user) {
            return {
                flag: true,
                data: 'User not exists'
            };
        }


        var checkPass = await common.passwordCheck(password)
        password = password.replaceAll(/ /g, '')
        if (checkPass == true) {
            if (user.name != null) {
                if (user.userRole == 'SUPER_ADMIN') {
                    const isPasswordMatched = await user.isPasswordMatch(password);
                    if (!isPasswordMatched) {
                        return {
                            flag: true,
                            data: 'Incorrect Old Password'
                        };
                    }
                    password = await bcrypt.hash(password, 8);
                } else {
                    const decryptPassword = common.passwordConvert(user.password, 'decrypt')
                    if (decryptPassword !== oldPassword) {
                        return {
                            flag: true,
                            data: 'Incorrect Old Password'
                        };
                    }
                    password = common.passwordConvert(password, 'encrypt')
                }
            } else {
                const decryptPassword = common.passwordConvert(user.password, 'decrypt')
                if (decryptPassword !== oldPassword) {
                    return {
                        flag: true,
                        data: 'Incorrect Old Password'
                    };
                }
                password = common.passwordConvert(password, 'encrypt')
            }

            let updatedUser = sqlService.update(modelName, where, { password: password });
            if (!updatedUser) {
                return {
                    flag: true,
                    data: 'password can not changed due to some error.please try again'
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

const schoolForgotPassword = async (email) => {
    try {

        let token = uuid();
        let expires = dayjs();
        expires = expires.add(FORGOT_PASSWORD_WITH.EXPIRE_TIME, 'minute').toISOString();
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
            if (userData.isActive == 0) {
                return {
                    flag: true,
                    data: 'You are blocked by Admin, Please contact to Admin.'
                };
            }

            // var link_expiry_time = new Date(+new Date() + 1 * 24 * 60 * 60 * 1000);
            let updateData = {
                'recoveryCode': token,
                'linkExpiryTime': expires,
                'linkStatus': 0
            };
            await sqlService.update(model.adminUser, { id: { [Op.ne]: '' } }, updateData);
            let viewType = '/school-admin/create-password/';
            let mailObj = {
                subject: 'Reset Password',
                to: userCheckData.passwordReCoveryEmail,
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

const forgotPassword = async (modelName, where, getViewType, attributes) => {
    try {

        let token = uuid();
        let expires = dayjs();
        expires = expires.add(FORGOT_PASSWORD_WITH.EXPIRE_TIME, 'minute').toISOString();
        const userCheck = await sqlService.findOneSelected(modelName, where, attributes);
        if (!userCheck) {
            return {
                flag: true,
                data: 'Email not exists'
            };
        } else {
            const userData = userCheck.toJSON();
            if (userData.isActive == 0) {
                return {
                    flag: true,
                    data: 'You are blocked by Admin, Please contact to Admin.'
                };
            }
            let updateData = {
                'recoveryCode': token,
                'linkExpiryTime': expires,
                'linkStatus': 0
            };
            await sqlService.update(modelName, where, updateData);

            let viewType = getViewType;
            let mailObj = {
                subject: 'Reset Password',
                to: userData.email,
                template: '/views/email/ResetPassword',
                data: {
                    userName: userData.username || '-',
                    link: `${process.env.BASE_URL + (process.env.NODE_ENV == ENVIROMENT.prod ? "" : ":" + process.env.PORT)}` + viewType + token,
                    linkText: 'Reset Password',
                    url: ''
                }
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
    schoolForgotPassword,
    forgotPassword,
};