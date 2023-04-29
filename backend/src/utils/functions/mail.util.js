import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_ADDRESS,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendEmail = async ({ to, subject, text }) => {
  const mailOptions = {
    from: process.env.EMAIL_ADDRESS,
    to,
    subject,
    html: text,
  };

  await transporter.sendMail(mailOptions);
};

const getMailTemplate = (
  appName,
  username,
  url
) => `<!DOCTYPE html><html lang="en-US"><head><meta content="text/html; charset=utf-8" http-equiv="Content-Type"><title>Reset Password Email Template</title><meta name="description" content="Reset Password Email."></head><body style="margin:2rem;font-family:Arial,Helvetica,sans-serif"><h1 style="color:#537bd2;font-size:30px;font-weight:700;text-align:center">${appName}</h1><h2 style="font-size:26px;font-weight:700">Hi ${username},</h2><p style="font-weight:500">You recently requested to reset your password for your ${appName} account.<strong style="font-weight:700;color:#626262">Use the button below to reset it. This password reset is only valid for the next 24 hours.</strong></p><a href="${url}" style="background-color:#537bd2;display:inline-block;color:#fff;margin:1rem 0;padding:12px 18px;font-weight:500;text-decoration:none;border-radius:3px;text-align:center;box-shadow:0 2px 3px rgba(0,0,0,.16)">Reset your password</a><p style="font-weight:500">If you're having trouble with the button above, copy and paste the URL below into your web browser:</p><a href="${url}" style="color:#537bd2;font-weight:500">${url}</a><br><br><p style="font-weight:500">Thanks,</p><p style="font-weight:500">Your ${appName} team</p><br><hr><span style="font-weight:700;color:#626262">If you did not request a password reset, please ignore this email.</span></body></html><!DOCTYPE html>
<html lang="en-US">
  <head>
    <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
    <title>Reset Password Email Template</title>
    <meta name="description" content="Reset Password Email." />
  </head>
  <body
    style="
      margin: 2rem;
      font-size: 20px;
      font-family: Arial, Helvetica, sans-serif;
    "
  >
    <h1
      style="
        color: #537bd2;
        font-size: 2rem;
        font-weight: 700;
        text-align: center;
      "
    >
      ${appName}
    </h1>
    <h2 style="font-size: 1.5rem; font-weight: 700">Hi ${username},</h2>
    <p style="font-weight: 500">
      You recently requested to reset your password for your ${appName}
      account.<strong style="font-weight: 700; color: #626262"
        >Use the button below to reset it. This password reset is only valid for
        the next 24 hours.</strong
      >
    </p>
    <a
      href="${url}"
      style="
        background-color: #537bd2;
        display: inline-block;
        color: #fff;
        margin: 1rem 0;
        padding: 12px 18px;
        font-weight: 500;
        text-decoration: none;
        border-radius: 3px;
        text-align: center;
        box-shadow: 0 2px 3px rgba(0, 0, 0, 0.16);
      "
      >Reset your password</a
    >
    <p style="font-weight: 500">
      If you're having trouble with the button above, copy and paste the URL
      below into your web browser:
    </p>
    <a href="${url}" style="color: #537bd2; font-weight: 500">${url}</a
    ><br /><br />
    <p style="font-weight: 500">Thanks,</p>
    <p style="font-weight: 500">Your ${appName} team</p>
    <br />
    <hr />
    <span style="font-weight: 700; color: #626262"
      >If you did not request a password reset, please ignore this email.</span
    >
  </body>
</html>
`;

export const mailUtil = {
  sendEmail,
  getMailTemplate,
};
