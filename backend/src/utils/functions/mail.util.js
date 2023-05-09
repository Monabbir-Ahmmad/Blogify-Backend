import { environment } from "../../configs/environment.config.js";
import nodemailer from "nodemailer";

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

const getResetPasswordMailTemplate = (
  appName,
  username,
  url = "#"
) => `<body style="font-family: Arial, sans-serif; font-size: 16px; line-height: 1.5; color: #333333; background-color: #ffffff; padding: 0;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; text-align: center; padding: 40px; box-sizing: border-box; border: 1px solid #e0e0e0;">
    <h1 style="font-size: 26px; margin-top: 0; margin-bottom: 20px; color: #00aaff;">${appName}</h1>
    <h2 style="font-size: 22px; margin-top: 0; margin-bottom: 20px; color: #707070;">Password Reset Request</h2>
    <p style="margin-bottom: 20px; color: #666666;">Hello ${username},</p>
    <p style="margin-bottom: 20px; color: #666666;">You are receiving this email because you have requested a password reset for your ${appName} account. This link will be valid for the next 24 hours:</p>
    <a href="${url}" style="display: inline-block; padding: 10px 20px; background-color: #00bfa6; color: #ffffff; text-decoration: none; border-radius: 5px; margin-bottom: 40px;">Reset Password</a>
    <p style="margin-bottom: 20px; color: #666666;">If you did not make this request, you can safely ignore this email.</p>
    <p style="margin-bottom: 20px; color: #666666;">Thank you for using <span style="color: #00aaff; font-weight: bold;">${appName}</span>! </p>
    <p style="font-size: 12px; margin: 0; color: #666666; margin-top: 20px;">This link will expire in 24 hours.</p>
  </div>
</body>
`;

export const mailUtil = {
  sendEmail,
  getResetPasswordMailTemplate,
};
