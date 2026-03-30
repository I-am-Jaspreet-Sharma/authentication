import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
});
const sendMail = async (to, subject, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM_EMAIL}>`,
      to,
      subject,
      html,
    });

    console.log("EMAIL SENT:", info);
  } catch (err) {
    console.error("EMAIL ERROR:", err);
  }
};
const sendVerificationMail = async (to, token) => {
  const url = `${process.env.CLIENT_URL}/api/auth/verify/${token}`;
  await sendMail(
    to,
    "Verify your email",
    `<h2>Welcome!</h2><p>Click <a href="${url}">here</a> to verify your email.</p>`,
  );
};
const sendResetPasswordMail = async (to, token) => {
  const url = `${process.env.CLIENT_URL}/api/auth/new-password/${token}`;
  await sendMail(
    to,
    "Reset your password",
    `<h2>Password Reset</h2><p>Click <a href="${url}">here</a> to reset your password. This link expires in 15 minutes.</p>`,
  );
};

export {sendMail, sendVerificationMail, sendResetPasswordMail};
