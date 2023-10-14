const crypto = require("crypto");
const http = require("https");
const date = require('date-and-time');
const { Op, literal } = require('sequelize');
const { ENC_TYPE } = require("../constants/appConstants");
const auth_key = "@hvGXdspUQZQ1jJPAfDopItHTLFfTqh(krollo)30sn^MKo39CByMdgUU3cwviR4a7P1fnZXcK";

/**
 * Logs a message with a decorative border.
 *
 * @param {string} message - The message to log.
 */
function beautifyLog(message) {
    console.log("=========================================");
    console.error(message);
    console.log("=========================================");
}

/**
 * Sends an SMS message to a mobile number.
 *
 * @param {string} message - The SMS message to send.
 * @param {string} mobile - The mobile number to send the message to.
 */
function sendSms(message, mobile) {
    var options = {
        "method": "GET",
        "hostname": "2factor.in",
        "port": null,
        "path": `API_PATH_TO_BE_INSERTED_WITH_${mobile}_AND${message}`,
        "headers": {}
    };
    var req = http.request(options, function (res) {
        var chunks = [];

        res.on("data", function (chunk) {
            chunks.push(chunk);
        });

        res.on("end", function () {
            var body = Buffer.concat(chunks);
        });
    });
    req.end();
}

/**
 * Generates a random string of a specified length.
 *
 * @param {number} len - The length of the random string to generate.
 * @returns {string} A random string of the specified length.
 */
function randomString(len) {
    charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var randomString = '';
    for (var i = 0; i < len; i++) {
        var randomPoz = Math.floor(Math.random() * charSet.length);
        randomString += charSet.substring(randomPoz, randomPoz + 1);
    }
    return randomString;
}

/**
 * Generates a random string of alphabetic characters.
 *
 * @param {number} len - The length of the random alphabetic string to generate.
 * @returns {string} A random alphabetic string of the specified length.
 */
function randomAlphaString(len) {
    charSet = 'DEFGHIJKLMNOPQRSTUVWdefghijklmnopqrstuvw';
    var randomString = '';
    for (var i = 0; i < len; i++) {
        var randomPoz = Math.floor(Math.random() * charSet.length);
        randomString += charSet.substring(randomPoz, randomPoz + 1);
    }
    return randomString;
}

/**
 * Changes the characters in a string by a specified amount.
 *
 * @param {string} text - The text to change.
 * @param {number} n - The amount to change the characters by.
 * @returns {string} The modified string.
 */
function changeAlphaString(text, n) {
    var text = '' + text + ''
    var array = text.split('');
    var changeString = '';
    for (var i = 0; i < array.length; i++) {
        var assci = array[i].charCodeAt(0);
        var new_number = parseInt(assci) + parseInt(n)
        if (assci >= 97 && assci <= 122) {
            if (new_number > 122) {
                var extra = parseInt(new_number) - parseInt(122);
                var final = parseInt(96) + parseInt(extra);
                var changeString = changeString + String.fromCharCode(final);
            } else {
                var changeString = changeString + String.fromCharCode(new_number);
            }
        } else {
            if (new_number > 90) {
                var extra = parseInt(new_number) - parseInt(90);
                var final = parseInt(64) + parseInt(extra);
                var changeString = changeString + String.fromCharCode(final);
            } else {
                var changeString = changeString + String.fromCharCode(new_number);
            }
        }
    }
    return changeString;
}

/**
 * Encrypts or decrypts data using AES-256-ECB encryption.
 *
 * @param {string} text - The data to be encrypted or decrypted.
 * @param {string} key - The encryption key.
 * @param {string} type - The type of operation ('encrypt' or 'decrypt').
 * @returns {string|Object|boolean} The encrypted data (if encrypting), the decrypted object (if decrypting), or `false` (if decryption fails).
 */
function EncrptDecryptApiData(text, key, type) {
    if (type.toString() === 'encrypt') {
        const cipher = crypto.createCipheriv("aes-256-ecb", key, null);
        var encrypted = cipher.update(text, 'utf8', 'base64') + cipher.final('base64'); // encrypted text
        return encrypted;
    } else {
        try {
            var decipher = crypto.createDecipheriv("aes-256-ecb", key, null);
            var decrypted = decipher.update(text, 'base64', 'utf8') + decipher.final('utf8');
            var object = JSON.parse(decrypted);
            return object;
        }
        catch {
            return false;
        }
    }
}

/**
 * Performs encryption or decryption using AES-256-CBC encryption.
 *
 * @param {string} text - The data to be encrypted or decrypted.
 * @param {string} type - The type of operation ('encrypt' or 'decrypt').
 * @returns {string} The encrypted data (if encrypting), the decrypted data (if decrypting).
 */
function cryptoFun(text, type) {
    var algorithm = 'aes-256-cbc';
    var password = process.env.CRYPTO_PASSWORD;
    var key = crypto.scryptSync(password, 'salt', 32, { N: 1024 }); //create key
    var iv = crypto.scryptSync(password, 'salt', 16, { N: 1024 }); //create initVector

    if (type.toString() === ENC_TYPE[0]) {
        var cipher = crypto.createCipheriv(algorithm, key, iv);
        var encrypted = cipher.update(text.toString(), 'utf8', 'hex') + cipher.final('hex'); // encrypted text
        return encrypted.toString();
    } else {
        var decipher = crypto.createDecipheriv(algorithm, key, iv);
        var decrypted = decipher.update(text.toString(), 'hex', 'utf8') + decipher.final('utf8'); //decrypted text
        return decrypted.toString();
    }
}

/**
 * Checks the authenticity of a request based on an app key.
 *
 * @param {string} app_key - The app key to check.
 * @returns {boolean} `true` if the key is authentic, `false` otherwise.
 */
function checkRequestAuth(app_key) {
    var key = 'qwertyuiopasdfgh';
    var decipher = crypto.createDecipheriv("aes-128-ecb", key, null);
    var check_key = decipher.update(app_key, 'hex', 'utf8') + decipher.final('utf8');
    if (check_key == auth_key) {
        return true;
    } else {
        return false;
    }
}

/**
 * Generates an OTP (One-Time Password).
 *
 * @param {number} length - The length of the OTP to generate.
 * @returns {number} The generated OTP.
 */
function getOtp(length) {
    if (process.env.NODE_ENV === TEST || process.env.NODE_ENV === DEV) {
        return 1234;
    } else {
        if (length == 4) {
            return Math.floor(1000 + Math.random() * 9000);
        } else {
            return Math.floor(100000 + Math.random() * 900000);
        }
    }
}

/**
 * Checks and decrypts API data before processing.
 *
 * @param {string} reqkey - The API key for decryption.
 * @param {string} reqdata - The data to decrypt.
 * @returns {Object} The decrypted data.
 */
function getCheckApiDataBefore(reqkey, reqdata) {
    var mykey = reqkey.match(/.{1,8}/g)
    var myKey1 = changeAlphaString(mykey[1], 3)
    var myKey2 = changeAlphaString(mykey[3], 3)
    var original_key = mykey[0] + myKey1 + mykey[2] + myKey2
    var decData = EncrptDecryptApiData(reqdata, original_key, 'decrypt');
    return decData;
}

/**
 * Encrypts and processes API data before sending the response.
 *
 * @param {Object} finalResult - The data to be processed and encrypted.
 * @returns {Object} The processed and encrypted data along with the original encryption key.
 */
function getCheckApiDataAfter(finalResult) {
    let response = JSON.stringify(finalResult);
    var key = randomAlphaString(32)
    var resData = EncrptDecryptApiData(response, key, 'encrypt')
    var mykey = key.match(/.{1,8}/g)
    var myKey1 = changeAlphaString(mykey[1], 3)
    var myKey2 = changeAlphaString(mykey[3], 3)
    var original = mykey[0] + myKey1 + mykey[2] + myKey2

    return { resData, original }
}

/**
 * Retrieves the current session data.
 *
 * @returns {Promise<Object>} A Promise that resolves to the current session data.
 */
async function getCurrentSession() {
    let now = new Date();
    let currentDate = new Date(date.format(now, 'YYYY'), date.format(now, 'MM') - 1, date.format(now, 'DD'))
    let sessionData = await schoolSessions.findOne({
        attributes: ['id', 'sessionName', 'session', 'sessionStart', 'sessionEnd'],
        where: {
            [Op.and]: [
                literal(`DATE(sessionStart) <= DATE('${currentDate.toISOString()}')`),
                literal(`DATE(sessionEnd) >= DATE('${currentDate.toISOString()}')`)
            ]
        }
    })

    return sessionData;
}

/**
 * Removes duplicate elements from an array based on specified keys.
 *
 * @param {Object[]} array - The array to remove duplicates from.
 * @param {string[]} keys - The keys to use for duplicate checking.
 * @returns {Object[]|null} An array of duplicates or `null` if there are no duplicates.
 */
function getRemoveDuplicateArrayFilter(array, keys) {
    const duplicates = [];
    const seen = {};

    for (let i = 0; i < array.length; i++) {
        const obj = array[i];
        let foundDuplicate = false;

        for (let j = 0; j < keys.length; j++) {
            const key = keys[j];

            if (seen[key] && seen[key].has(obj[key])) {
                duplicates.push({
                    key,
                    position: i + 1
                });
                foundDuplicate = true;
                break;
            }

            if (!seen[key]) {
                seen[key] = new Set();
            }
            seen[key].add(obj[key]);
        }

        if (foundDuplicate) {
            break;
        }
    }

    return duplicates.length > 0 ? duplicates : null;
}

module.exports = {
    beautifyLog,
    sendSms,
    randomString,
    randomAlphaString,
    changeAlphaString,
    EncrptDecryptApiData,
    crypto:cryptoFun,
    checkRequestAuth,
    getOtp,
    getCheckApiDataBefore,
    getCheckApiDataAfter,
    getCurrentSession,
    getRemoveDuplicateArrayFilter,
};
