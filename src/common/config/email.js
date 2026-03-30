import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendMail = async (to, subject, html) => {
  try {
    const msg = {
      to,
      from: process.env.SMTP_FROM_EMAIL,
      subject,
      html,
    };

    const response = await sgMail.send(msg);
    console.log("EMAIL SENT:", response[0].statusCode);
  } catch (err) {
    console.error("EMAIL ERROR:", err.response?.body || err.message);
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
