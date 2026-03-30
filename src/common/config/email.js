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
    "Verify your email address",
    `
    <div style="font-family: Arial, sans-serif; background-color:#f4f4f4; padding:20px;">
      <table align="center" width="600" style="background:#ffffff; padding:20px; border-radius:8px;">
        <tr>
          <td align="center">
            <h2 style="color:#333;">Welcome to Our App 👋</h2>
          </td>
        </tr>

        <tr>
          <td>
            <p style="color:#555; font-size:14px;">
              Hi there,
            </p>
            <p style="color:#555; font-size:14px;">
              Thanks for signing up! Please confirm your email address by clicking the button below:
            </p>

            <div style="text-align:center; margin:20px 0;">
              <a href="${url}" 
                 style="background:#4CAF50; color:#fff; padding:12px 20px; text-decoration:none; border-radius:5px; display:inline-block;">
                 Verify Email
              </a>
            </div>

            <p style="color:#999; font-size:12px;">
              If you didn’t create an account, you can safely ignore this email.
            </p>
          </td>
        </tr>

        <tr>
          <td style="border-top:1px solid #eee; margin-top:20px; padding-top:10px;">
            <p style="font-size:12px; color:#aaa; text-align:center;">
              © ${new Date().getFullYear()} Your Company. All rights reserved.
            </p>
          </td>
        </tr>
      </table>
    </div>
    `

  );
};
const sendResetPasswordMail = async (to, token) => {
  const url = `${process.env.CLIENT_URL}/api/auth/new-password/${token}`;
  await sendMail(
    to,
    "Reset your password",
    `
    <div style="font-family: Arial, sans-serif; background-color:#f4f4f4; padding:20px;">
      <table align="center" width="600" style="background:#ffffff; padding:20px; border-radius:8px;">
        <tr>
          <td align="center">
            <h2 style="color:#333;">Password Reset Request</h2>
          </td>
        </tr>

        <tr>
          <td>
            <p style="color:#555; font-size:14px;">
              We received a request to reset your password.
            </p>

            <div style="text-align:center; margin:20px 0;">
              <a href="${url}" 
                 style="background:#e63946; color:#fff; padding:12px 20px; text-decoration:none; border-radius:5px;">
                 Reset Password
              </a>
            </div>

            <p style="color:#999; font-size:12px;">
              This link will expire in 15 minutes.
            </p>

            <p style="color:#999; font-size:12px;">
              If you didn’t request this, please ignore this email.
            </p>
          </td>
        </tr>

        <tr>
          <td style="border-top:1px solid #eee; padding-top:10px;">
            <p style="font-size:12px; color:#aaa; text-align:center;">
              © ${new Date().getFullYear()} Your Company
            </p>
          </td>
        </tr>
      </table>
    </div>
    `
  );
};

export {sendMail, sendVerificationMail, sendResetPasswordMail};
