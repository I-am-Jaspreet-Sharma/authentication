import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
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