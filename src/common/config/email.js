import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const sendMail = async (to, subject, html) => {
  const msg = {
    from: process.env.SMTP_FROM_EMAIL,
    to,
    subject,
    html,
    text: html.replace(/<[^>]*>?/gm, ""),
  };

const { data, error } = await resend.emails.send(msg);

if (error) {
  console.error("EMAIL ERROR:", error);
  return;
}

console.log("EMAIL SENT ✅");
console.log("Email ID:", data?.id);
};

const sendVerificationMail = async (to, token) => {
  const url = `${process.env.CLIENT_URL}/api/auth/verify/${token}`;
  await sendMail(
    to,
    "Verify your email address",
    `
    <div style="font-family: Arial, sans-serif; background-color:#f6f9fc; padding:40px 0;">
      <table align="center" width="520" style="background:#ffffff; padding:30px; border-radius:10px;">
        
        <tr>
          <td align="center">
            <h2 style="color:#222; margin-bottom:10px;">Confirm your email</h2>
            <p style="color:#555; font-size:14px;">
              You're almost there. Please verify your email to continue.
            </p>
          </td>
        </tr>

        <tr>
          <td align="center" style="padding:25px 0;">
            <a href="${url}" 
               style="background:#2563eb; color:#ffffff; padding:12px 24px; text-decoration:none; border-radius:6px; font-size:14px;">
               Verify Email
            </a>
          </td>
        </tr>

        <tr>
          <td>
            <p style="color:#666; font-size:13px;">
              If the button doesn't work, copy and paste this link into your browser:
            </p>
            <p style="word-break:break-all; font-size:12px; color:#2563eb;">
              ${url}
            </p>
          </td>
        </tr>

        <tr>
          <td style="padding-top:20px;">
            <p style="font-size:12px; color:#999;">
              If you didn’t create an account, you can safely ignore this email.
            </p>
          </td>
        </tr>

        <tr>
          <td style="border-top:1px solid #eee; padding-top:15px;">
            <p style="font-size:11px; color:#aaa; text-align:center;">
              © ${new Date().getFullYear()} Your Company · All rights reserved
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
    <div style="font-family: Arial, sans-serif; background-color:#f6f9fc; padding:40px 0;">
      <table align="center" width="520" style="background:#ffffff; padding:30px; border-radius:10px;">
        
        <tr>
          <td align="center">
            <h2 style="color:#222;">Reset your password</h2>
            <p style="color:#555; font-size:14px;">
              We received a request to reset your password.
            </p>
          </td>
        </tr>

        <tr>
          <td align="center" style="padding:25px 0;">
            <a href="${url}" 
               style="background:#dc2626; color:#ffffff; padding:12px 24px; text-decoration:none; border-radius:6px; font-size:14px;">
               Reset Password
            </a>
          </td>
        </tr>

        <tr>
          <td>
            <p style="color:#666; font-size:13px;">
              This link will expire in 15 minutes.
            </p>
            <p style="word-break:break-all; font-size:12px; color:#dc2626;">
              ${url}
            </p>
          </td>
        </tr>

        <tr>
          <td style="padding-top:20px;">
            <p style="font-size:12px; color:#999;">
              If you didn’t request this, you can ignore this email.
            </p>
          </td>
        </tr>

        <tr>
          <td style="border-top:1px solid #eee; padding-top:15px;">
            <p style="font-size:11px; color:#aaa; text-align:center;">
              © ${new Date().getFullYear()} Your Company
            </p>
          </td>
        </tr>

      </table>
    </div>
    `

  );
};

export { sendMail, sendVerificationMail, sendResetPasswordMail };
