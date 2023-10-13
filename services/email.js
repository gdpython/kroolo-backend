/**
 * emailService.js
 * @description Exports functions used in sending emails using different providers.
 * @module emailService
 */

const nodemailer = require("nodemailer");
const ejs = require("ejs");
const { SESClient, SendEmailCommand } = require("@aws-sdk/client-ses");

/**
 * Sends an email using Amazon SES (Simple Email Service).
 *
 * @async
 * @function sendMailSES
 * @param {object} object - The email parameters and content.
 * @param {string} object.to - The recipient's email address.
 * @param {string} object.subject - The email subject.
 * @param {string} object.template - The path to the email template.
 * @param {object} [object.data] - Data to be injected into the email template.
 * @param {Array<object>} [object.attachments] - An array of email attachments.
 * @returns {Promise<boolean>} Returns true if the email is sent successfully, or false if there is an error.
 */
const sendMailSES = async (object) => {
  try {
    const sesClient = new SESClient({
      region: "us-east-1",
      credentials: {
        accessKeyId: process.env.SES_ACCESS_KEY_ID,
        secretAccessKey: process.env.SES_SECRET_ACCESS_KEY_ID,
      },
    });
    var params = {
      Destination: {
        ToAddresses: [object.to],
      },
      Message: {
        Body: {
          Html: {
            Charset: "UTF-8",
            Data: await ejs.renderFile(
              `${__basedir}${object.template}/html.ejs`,
              object.data || null
            ),
          },
        },
        Subject: {
          Charset: "UTF-8",
          Data: object.subject,
        },
      },
      Source: process.env.DEFAULT_EMAIL,
      Attachments: object.attachments || [],
    };
    const command = new SendEmailCommand(params);
    const response = await sesClient.send(command);
    console.log("Email sent:", response.MessageId);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};

/**
 * Sends an email using SMTP (Simple Mail Transfer Protocol).
 *
 * @async
 * @function sendMailSMTP
 * @param {object} obj - The email parameters and content.
 * @param {string} [obj.from] - The sender's email address.
 * @param {string} [obj.subject] - The email subject.
 * @param {string} obj.to - The recipient's email address.
 * @param {Array<string>} [obj.cc] - An array of email addresses to be cc'd.
 * @param {Array<string>} [obj.bcc] - An array of email addresses to be bcc'd.
 * @param {string} [obj.template] - The path to the email template.
 * @param {object} [obj.data] - Data to be injected into the email template.
 * @param {Array<object>} [obj.attachments] - An array of email attachments.
 * @returns {Promise<boolean>} Returns true if the email is sent successfully, or false if there is an error.
 */
async function sendMailSMTP(obj) {
  let transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, // use SSL
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });
  let htmlText = "";
  if (obj.template) {
    htmlText = await ejs.renderFile(
      `${__basedir}${obj.template}`,
      obj.data || null
    );
  }
  let mailOpts = {
    from: obj.from || process.env.SMTP_MAIL,
    subject: obj.subject || "Sample Subject",
    to: obj.to,
    cc: obj.cc || [],
    bcc: obj.bcc || [],
    html: htmlText,
    attachments: obj.attachments || [],
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOpts, function (err, success) {
      if (err) {
        console.error(`Error sending email: ${err.message}`);
        resolve(false);
      } else {
        console.log(`Email sent successfully.`);
        resolve(true);
      }
    });
  });
}

module.exports = { sendMail: sendMailSMTP, sendSesEmail: sendMailSES };
