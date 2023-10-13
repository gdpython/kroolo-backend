/**
 * @description Constants used in email.
 * @module authConstant
 */

const EMAIL_VERIFY = {
  SUBJECT: "Verify your email address",
  LINK: {
    email: true,
    sms: false,
  },
  EXPIRE_TIME: 10,
};

module.exports = {
  EMAIL_VERIFY,
};
