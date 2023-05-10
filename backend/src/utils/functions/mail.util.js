import ejs from "ejs";
import { environment } from "../../configs/environment.config.js";
import nodemailer from "nodemailer";
import path from "path";

const rootDir = process.cwd();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: environment.EMAIL_ADDRESS,
    pass: environment.EMAIL_PASSWORD,
  },
});

/**
 * @param {Object} mailOptions
 * @param {string} mailOptions.to
 * @param {string} mailOptions.subject
 * @param {string} mailOptions.text
 * @param {string} mailOptions.html
 */
const sendEmail = async ({ to, subject, text, html }) => {
  const mailOptions = {
    from: environment.EMAIL_ADDRESS,
    to,
    subject,
    text,
    html,
  };

  return await transporter.sendMail(mailOptions);
};

/**
 * @description Generates reset password email template
 * @param {string} appName
 * @param {string} username
 * @param {string} url
 * @returns {Promise<string>}
 */
const getResetPasswordMailTemplate = async (appName, username, url = "#") =>
  await ejs.renderFile(
    path.resolve(rootDir, "src", "templates", "resetPasswordEmail.ejs"),
    {
      appName,
      username,
      url,
    }
  );

export const mailUtil = {
  sendEmail,
  getResetPasswordMailTemplate,
};
