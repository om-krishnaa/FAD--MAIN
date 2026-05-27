import { transporter } from "../utils/mailer";

require("dotenv").config();

export const sendEmail = async (
  to: string,
  subject: string,
  text: string,
  html: string | null = null
) => {
  try {
    const mailOptions = {
      from: `"FAD Platform" <${process.env.SMTP_USER}>`,
      to,
      subject,
      text,
      html: html || text,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully to:", to);
    console.log("Message ID:", info.messageId);

    return {
      success: true,
      messageId: info.messageId,
      recipient: to,
    };
  } catch (error) {
    let message = "Unknown error";
    if (error instanceof Error) {
      message = error.message;
    }
    console.error("❌ Error sending email:", message);

    return {
      success: false,
      error: message,
      recipient: to,
    };
  }
};

export const sendWelcomeEmail = async (userEmail: string, userName: string) => {
  const subject = "Welcome to FAD Platform! 🎉";
  const text = `Hello ${userName},

Welcome to FAD Platform! We're excited to have you join our community.

Your account has been successfully created and you can now access all our features.

If you have any questions, feel free to reach out to our support team.

Best regards,
The FAD Platform Team`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background-color: #f9f9f9; }
            .footer { padding: 10px; text-align: center; color: #666; font-size: 12px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Welcome to FAD Platform! 🎉</h1>
            </div>
            <div class="content">
                <h2>Hello ${userName}!</h2>
                <p>Welcome to FAD Platform! We're excited to have you join our community.</p>
                <p>Your account has been successfully created and you can now access all our features.</p>
                <p>If you have any questions, feel free to reach out to our support team.</p>
            </div>
            <div class="footer">
                <p>Best regards,<br>The FAD Platform Team</p>
            </div>
        </div>
    </body>
    </html>
  `;

  return await sendEmail(userEmail, subject, text, html);
};

export const sendPasswordResetEmail = async (
  userEmail: string,
  code: string
) => {
  const subject = "Password Reset Request - FAD Platform";
  const text = `You requested a password reset for your FAD Platform account.

Click the link below to reset your password:
${code}


This link will expire in 1 hour.

If you didn't request this reset, please ignore this email.

Best regards,
The FAD Platform Team`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #FF6B6B; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background-color: #f9f9f9; }
            .button { display: inline-block; padding: 12px 24px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 4px; margin: 10px 0; }
            .footer { padding: 10px; text-align: center; color: #666; font-size: 12px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Password Reset Request</h1>
            </div>
            <div class="content">
                <p>You requested a password reset for your FAD Platform account.</p>
                <p>Code: ${code}</p>
                <p>If you didn't request this reset, please ignore this email.</p>
            </div>
            <div class="footer">
                <p>Best regards,<br>The FAD Platform Team</p>
            </div>
        </div>
    </body>
    </html>
  `;

  return await sendEmail(userEmail, subject, text, html);
};

export const sendContactFormEmail = async (
  name: string,
  email: string,
  message: string,
  adminEmail = "admin@fadplatform.com"
) => {
  const subject = `New Contact Form Submission from ${name}`;
  const text = `New contact form submission:

Name: ${name}
Email: ${email}
Message: ${message}

Reply to: ${email}`;

  const html = `
    <h2>New Contact Form Submission</h2>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Message:</strong></p>
    <div style="border-left: 4px solid #4CAF50; padding-left: 15px; margin: 10px 0;">
        ${message.replace(/\n/g, "<br>")}
    </div>
    <p><a href="mailto:${email}">Reply to ${name}</a></p>
  `;

  return await sendEmail(adminEmail, subject, text, html);
};

export const sendEmailVerificationEmail = async (
  userEmail: string,
  userName: string,
  verificationToken: string,
  verificationUrl: string
) => {
  const subject = "Verify Your Email - FAD Platform";
  const text = `Hello ${userName},

Please verify your email address to complete your registration on FAD Platform.

Click the link below to verify:
${verificationUrl}

Or use this token: ${verificationToken}

This link will expire in 24 hours.

Best regards,
The FAD Platform Team`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #2196F3; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background-color: #f9f9f9; }
            .button { display: inline-block; padding: 12px 24px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 4px; margin: 10px 0; }
            .footer { padding: 10px; text-align: center; color: #666; font-size: 12px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Email Verification</h1>
            </div>
            <div class="content">
                <h2>Hello ${userName}!</h2>
                <p>Please verify your email address to complete your registration on FAD Platform.</p>
                <p><a href="${verificationUrl}" class="button">Verify Email</a></p>
                <p>Or copy this link: <br>${verificationUrl}</p>
                <p><strong>Verification Token:</strong> ${verificationToken}</p>
                <p><em>This link will expire in 24 hours.</em></p>
            </div>
            <div class="footer">
                <p>Best regards,<br>The FAD Platform Team</p>
            </div>
        </div>
    </body>
    </html>
  `;

  return await sendEmail(userEmail, subject, text, html);
};

export async function sendVerificationEmail(email: string, code: string) {
  const subject = "Test Email from FAD";
  const html = `<div style="text-align:center;">
             <h2>Test Email</h2>
             <p>Your verification code: <strong>${code}</strong></p>
           </div>`;

  return await sendEmail(email, subject, "Hello", html);
}

module.exports = {
  transporter,
  sendVerificationEmail,
  sendEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendContactFormEmail,
  sendEmailVerificationEmail,
};
