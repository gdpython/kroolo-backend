/** 
 * emailService.js
 * @description :: exports function used in sending mails using mailgun provider
 */

const nodemailer = require('nodemailer');
const ejs = require('ejs');
const { SESClient, SendEmailCommand } = require("@aws-sdk/client-ses");

const sendMailSES = async (object) => {
    console.log('====================================');
    console.log(object);
    console.log('====================================');
    try {
        const sesClient = new SESClient({
            region: 'us-east-1',
            credentials: {
                accessKeyId: process.env.SES_ACCESS_KEY_ID,
                secretAccessKey: process.env.SES_SECRET_ACCESS_KEY_ID
            }
        });
        var params = {
            Destination: {
                ToAddresses: [object.to]
            },
            Message: {
                Body: {
                    Html: {
                        Charset: "UTF-8",
                        Data: await ejs.renderFile(`${__basedir}${object.template}/html.ejs`, object.data || null)
                    },
                },
                Subject: {
                    Charset: "UTF-8",
                    Data: object.subject
                },
            },
            Source: process.env.DEFAULT_EMAIL,
            Attachments: object.attachments || []
        }
        const command = new SendEmailCommand(params);
        const response = await sesClient.send(command);
        console.log("Email sent:", response.MessageId);
        return true
    } catch (error) {
        console.error("Error sending email:", error);
        return false
    }
}


async function sendMailSMTP(obj) {
    // return new Promise(async (resolve, reject) => {
    let transporter = nodemailer.createTransport({
        host: "smtpout.secureserver.net",
        port: 465,
        auth: {
            user: process.env.DEFAULT_EMAIL,
            pass: process.env.DEFAULT_EMAIL_PASSWORD
        },
        tls: {
            rejectUnauthorized: false
        }
    })
    let htmlText = '';
    if (obj.template) {
        htmlText = await ejs.renderFile(`${__basedir}${obj.template}/html.ejs`, obj.data || null);
    }

    let mailOpts = {
        from: obj.from || process.env.DEFAULT_EMAIL,
        subject: obj.subject || 'Sample Subject',
        to: obj.to,
        cc: obj.cc || [],
        bcc: obj.bcc || [],
        html: htmlText,
        attachments: obj.attachments || []
    };
    transporter.sendMail(mailOpts, function (err, success) {
        if (err) {
            console.log(`inerror`, err.message);
            resolve(err);
        } else {
            console.log(`sucess`, true);
            resolve(true);
        }
    })
    // })
}


/////////////////////////////////////////
module.exports = { sendMail:sendMailSMTP, sendSesEmail: sendMailSES };