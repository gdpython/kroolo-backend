const crypto = require("crypto");
const http = require("https");
const date = require('date-and-time')
const { Op, literal } = require('sequelize');
const auth_key = "@hvGXdspUQZQ1jJPAfDopItHTLFfTqh(krollo)30sn^MKo39CByMdgUU3cwviR4a7P1fnZXcK";
const specialNumber = ["8058805830"]

module.exports = {
    beautifyLog: (message) => {
        console.log("=========================================");
        console.error(message);
        console.log("=========================================");
    },
    sendSms: (message, mobile) => {
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
                console.log(body.toString());
            });
        });
        req.end();
    },

    randomString: function (len) {
        charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var randomString = '';
        for (var i = 0; i < len; i++) {
            var randomPoz = Math.floor(Math.random() * charSet.length);
            randomString += charSet.substring(randomPoz, randomPoz + 1);
        }
        return randomString;
    },

    randomAlphaString: function (len) {
        charSet = 'DEFGHIJKLMNOPQRSTUVWdefghijklmnopqrstuvw';
        var randomString = '';
        for (var i = 0; i < len; i++) {
            var randomPoz = Math.floor(Math.random() * charSet.length);
            randomString += charSet.substring(randomPoz, randomPoz + 1);
        }
        return randomString;
    },

    changeAlphaString: function (text, n) {
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
    },

    EncrptDecryptApiData: (text, key, type) => {
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
                return false
            }
        }
    },

    crypto: function (text, type) {
        var algorithm = 'aes-256-cbc';
        var password = CRYPTO_PASSWORD;
        var key = crypto.scryptSync(password, 'salt', 32, { N: 1024 }); //create key
        var iv = crypto.scryptSync(password, 'salt', 16, { N: 1024 }); //create initVector

        if (type.toString() === 'encrypt') {
            var cipher = crypto.createCipheriv(algorithm, key, iv);
            var encrypted = cipher.update(text.toString(), 'utf8', 'hex') + cipher.final('hex'); // encrypted text
            return encrypted.toString();
        } else {
            var decipher = crypto.createDecipheriv(algorithm, key, iv);
            var decrypted = decipher.update(text.toString(), 'hex', 'utf8') + decipher.final('utf8'); //decrypted text
            return decrypted.toString();
        }
    },

    checkRequestAuth: function (app_key) {
        var key = 'qwertyuiopasdfgh';
        var decipher = crypto.createDecipheriv("aes-128-ecb", key, null);
        var check_key = decipher.update(app_key, 'hex', 'utf8') + decipher.final('utf8');
        console.log(check_key);
        if (check_key == auth_key) {
            return true
        } else {
            return false
        }
    },

    getOtp: function (length) {
        if (process.env.NODE_ENV === TEST || process.env.NODE_ENV === DEV) {
            return 1234
        } else {
            if (length == 4) {
                return Math.floor(1000 + Math.random() * 9000);
            } else {
                return Math.floor(100000 + Math.random() * 900000);
            }
        }
    },

    getCheckApiDataBefore: function (reqkey, reqdata) {
        var mykey = reqkey.match(/.{1,8}/g)
        var myKey1 = this.changeAlphaString(mykey[1], 3)
        var myKey2 = this.changeAlphaString(mykey[3], 3)
        var original_key = mykey[0] + myKey1 + mykey[2] + myKey2
        var decData = this.EncrptDecryptApiData(reqdata, original_key, 'decrypt');
        return decData;
    },

    getCheckApiDataAfter: function (finalResult) {
        let response = JSON.stringify(finalResult);
        var key = this.randomAlphaString(32)
        var resData = this.EncrptDecryptApiData(response, key, 'encrypt')
        var mykey = key.match(/.{1,8}/g)
        var myKey1 = this.changeAlphaString(mykey[1], 3)
        var myKey2 = this.changeAlphaString(mykey[3], 3)
        var original = mykey[0] + myKey1 + mykey[2] + myKey2

        return { resData, original }
    },
    getCurrentSession: async function () {
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
    },
    getRemoveDuplicateArrayFilter: (array, keys) => {
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
    },
}