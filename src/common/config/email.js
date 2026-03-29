import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "cec231163.cse.cec@cgc.edu.in",
    pass: process.env.GOOGLE_APP_PASSWORD, // The 16-character App Password
  },
});
const sendMail = async (to, subject, html) => {
  await transporter.sendMail({
    from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM_EMAIL}>`,
    to,
    subject,
    html,
  });
};
const sendVerificationMail = async (to, token) => {
  const url = `${process.env.CLIENT_URL}/verify/${token}`;
  await sendMail(
    to,
    "Verify your email",
    `<h2>Welcome!</h2><p>Click <a href="${url}">here</a> to verify your email.</p>`,
  );
};
const sendResetPasswordMail = async (to, token) => {
  const url = `${process.env.CLIENT_URL}/new-password/${token}`;
  await sendMail(
    to,
    "Reset your password",
    `<h2>Password Reset</h2><p>Click <a href="${url}">here</a> to reset your password. This link expires in 15 minutes.</p>`,
  );
};

export {sendMail, sendVerificationMail, sendResetPasswordMail};