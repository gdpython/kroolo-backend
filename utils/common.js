const { Op } = require('sequelize');
const sqlService = require('./sqlService');
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const formidable = require('formidable');
const fs = require('fs');
const multer = require("multer");
const axios = require('axios');
const { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");

/**
 * Converts an object to an array of its values.
 *
 * @param {object} obj - The object to be converted.
 * @returns {array} - The converted array containing the object's values.
 */
function convertObjectToEnum(obj) {
  const enumArr = [];
  Object.values(obj).map((val) => enumArr.push(val));
  return enumArr;
}

/**
 * Capitalizes a word according to the specified type.
 *
 * @param {string} word - The word to be capitalized.
 * @param {number} type - The type of capitalization (1 for first letter, 2 for all, 0 for default).
 * @returns {string} - The capitalized word.
 */
function textCapitalize(word, type) {
  const lower = word.toLowerCase();
  if (type == 1) return word.charAt(0).toUpperCase() + lower.slice(1);
  else if (type == 2) return lower;
  else return word.charAt(0).toUpperCase() + lower.slice(1);
}

/**
 * Converts a string to title case.
 *
 * @param {string} str - The input string.
 * @returns {string} - The string in title case.
 */
function titleCase(str) {
  var splitStr = str.toLowerCase().split(' ');
  for (var i = 0; i < splitStr.length; i++) {
    splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
  }
  return splitStr.join(' ');
}

/**
 * Checks an IFSC code using an external API.
 *
 * @param {string} ifsc - The IFSC code to be checked.
 * @returns {Promise} - A promise that resolves with the response or rejects with an error.
 */
async function checkIFSCcode(ifsc) {
  try {
    const response = await axios.get(`https://ifsc.razorpay.com/${ifsc}`, {
      method: 'GET',
    });
    return response;
  } catch (err) {
    return err;
  }
}

/**
 * Generates a random number of a specified length.
 *
 * @param {number} length - The length of the random number to be generated (default 4).
 * @returns {string} - The generated random number.
 */
function randomNumber(length = 4) {
  const numbers = '12345678901234567890';
  let result = '';
  for (let i = length; i > 0; i -= 1) {
    result += numbers[Math.round(Math.random() * (numbers.length - 1))];
  }
  return result;
}

/**
 * Generates a random password of a specified length.
 *
 * @param {number} passwordLength - The length of the random password to be generated (default 4).
 * @returns {string} - The generated random password.
 */
function generatePassword(passwordLength) {
  var numberChars = "0123456789";
  var upperChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var lowerChars = "abcdefghijklmnopqrstuvwxyz";
  var sp_chr = "@!%()";
  var allChars = numberChars + upperChars + lowerChars + sp_chr;
  var randPasswordArray = Array(passwordLength);
  randPasswordArray[0] = numberChars;
  randPasswordArray[1] = upperChars;
  randPasswordArray[2] = lowerChars;
  randPasswordArray[3] = sp_chr;
  randPasswordArray = randPasswordArray.fill(allChars, 4);
  return shuffleArray(randPasswordArray.map(function (x) { return x[Math.floor(Math.random() * x.length)] }).join(''));
}

/**
 * Shuffles an array randomly.
 *
 * @param {array} array - The array to be shuffled.
 * @returns {array} - The shuffled array.
 */
function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}

/**
 * Encrypts or decrypts text using a specified algorithm and password.
 *
 * @param {string} text - The text to be encrypted or decrypted.
 * @param {string} type - The type of operation ('encrypt' or 'decrypt').
 * @returns {string} - The encrypted or decrypted text.
 */
function passwordConvert(text, type) {
  var algorithm = 'aes-256-cbc';
  var password = 'DarkWorldEncryption';
  var key = crypto.scryptSync(password, 'salt', 32, { N: 16384 }).toString('hex');
  var iv = Buffer.alloc(16, 0);

  if (type === 'encrypt') {
    var cipher = crypto.createCipheriv(algorithm, key, iv);
    var encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  } else if (type === 'decrypt') {
    var decipher = crypto.createDecipheriv(algorithm, key, iv);
    var decrypted = decipher.update(text, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } else {
    return 'Invalid type. Use "encrypt" or "decrypt".';
  }
}

/**
 * Validates a password according to specified criteria.
 *
 * @param {string} password - The password to be validated.
 * @returns {string | boolean} - An error message or true if the password is valid.
 */
function passwordCheck(password) {
  var strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#%])(?=.{8,})");
  if (!strongRegex.test(password)) {
    return 'Password must contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character, and be at least 8 characters long.';
  }
  return true;
}

/**
 * Sends an email with the specified parameters.
 *
 * @param {string} mail - The target email address.
 * @param {string} subject - The email subject.
 * @param {string} message - The email message body.
 * @returns {Promise} - A promise that resolves on successful email sending or rejects on failure.
 */
async function sendMail(mail, subject, message) {
  var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'your@gmail.com',
      pass: 'yourpassword',
    },
  });

  var mailOptions = {
    from: 'your@gmail.com',
    to: mail,
    subject: subject,
    text: message,
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        reject(error);
      } else {
        resolve(info.response);
      }
    });
  });
}

/**
 * Generates a random alphanumeric string of a specified length.
 *
 * @param {number} len - The length of the random string.
 * @returns {string} - The generated random string.
 */
function randomString(len) {
  var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var randomString = '';
  for (var i = 0; i < len; i++) {
    var randomNum = Math.floor(Math.random() * chars.length);
    randomString += chars[randomNum];
  }
  return randomString;
}

/**
 * Replaces all occurrences of a string in another string.
 *
 * @param {string} string - The string to search in.
 * @param {string} search - The string to search for.
 * @param {string} replace - The string to replace occurrences with.
 * @returns {string} - The string with replacements.
 */
function replaceAll(string, search, replace) {
  return string.split(search).join(replace);
}

/**
 * Checks for unique validation while registering a user.
 *
 * @param {object} Model - The Sequelize model instance of the table.
 * @param {object} data - Data coming from the request.
 * @returns {boolean} - True if the data is unique, false if not.
 */
async function uniqueValidation(Model, data) {
  try {
    const result = await Model.findOne({ where: data });
    return !result;
  } catch (err) {
    return false;
  }
}

/**
 * Calculates the difference between two dates in time.
 *
 * @param {Date} currentDate - The current date.
 * @param {Date} toDate - The future date.
 * @returns {string} - The difference between the two dates in hours, minutes, and seconds.
 */
function getDifferenceOfTwoDatesInTime(currentDate, toDate) {
  const timeDiff = toDate - currentDate;
  const hours = Math.floor(timeDiff / 3600000);
  const minutes = Math.floor((timeDiff % 3600000) / 60000);
  const seconds = Math.floor((timeDiff % 60000) / 1000);
  return `${hours} hours, ${minutes} minutes, ${seconds} seconds`;
}

module.exports = {
  convertObjectToEnum,
  textCapitalize,
  titleCase,
  checkIFSCcode,
  randomNumber,
  generatePassword,
  shuffleArray,
  passwordConvert,
  passwordCheck,
  sendMail,
  randomString,
  replaceAll,
  uniqueValidation,
  getDifferenceOfTwoDatesInTime
};
