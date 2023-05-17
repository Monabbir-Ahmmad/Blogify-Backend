import ejs from "ejs";
import { environment } from "../configs/environment.config.js";
import nodemailer from "nodemailer";
import path from "path";

const rootDir = process.cwd();

/**
 * @category Utilities
 * @classdesc A class that provides the functionality to send emails.
 */
export class MailUtil {
  /**
   * Creates an instance of MailUtil.
   */
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: environment.EMAIL_ADDRESS,
        pass: environment.EMAIL_PASSWORD,
      },
    });
  }

  /**
   * Sends an email.
   * @param {Object} options - The options for sending the email.
   * @param {string} options.to - The email address of the recipient.
   * @param {string} options.subject - The subject of the email.
   * @param {string} options.text - The plain text content of the email.
   * @param {string} options.html - The HTML content of the email.
   * @returns {Promise<any>} A promise that resolves when the email is sent.
   */
  sendEmail({ to, subject, text, html }) {
    const mailOptions = {
      from: environment.EMAIL_ADDRESS,
      to,
      subject,
      text,
      html,
    };

    return this.transporter.sendMail(mailOptions);
  }

  /**
   * Gets the reset password email template rendered with the provided data.
   * @param {string} appName - The name of the application.
   * @param {string} username - The username of the user.
   * @param {string} [url="#"] - The reset password URL.
   * @returns {Promise<string>} A promise that resolves with the rendered email template.
   */
  async getResetPasswordMailTemplate(appName, username, url = "#") {
    const templatePath = path.resolve(
      rootDir,
      "src",
      "templates",
      "resetPasswordEmail.ejs"
    );

    return await ejs.renderFile(templatePath, {
      appName,
      username,
      url,
    });
  }
}

export const mailUtil = new MailUtil();
