/**
 * @file email.config.ts
 * @description Exports the email provider from the component-based configuration
 */

import { emailTransporter } from './components/component.email.config';
import { EmailResponse } from '../utils/email';

interface EmailOptions {
  from: string;
  to: string;
  subject: string;
  html: string;
}

const sendEmail = async (options: EmailOptions): Promise<void> => {
  try {
    await emailTransporter.sendMail(options);
    console.log(`Email sent to ${options.to}`);
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error;
  }
};

/**
 * Send verification code to user's email
 * @param email - Recipient email address
 * @param code - Verification code
 * @param tempAccountId - Temporary account ID
 */
export const sendVerificationCode = async (
  email: string,
  code: string,
  tempAccountId: string
): Promise<void> => {
  const emailOptions: EmailOptions = {
    from: process.env.EMAIL_FROM_ADDRESS || 'noreply@blissbite.com',
    to: email,
    subject: 'Verify your BlissBite account',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Welcome to BlissBite!</h2>
        <p>Thank you for signing up. To complete your registration, please use the verification code below:</p>
        <div style="background-color: #f4f4f4; padding: 15px; text-align: center; font-size: 24px; letter-spacing: 5px; font-weight: bold;">
          ${code}
        </div>
        <p>This code will expire in 30 minutes.</p>
        <p>If you did not request this verification, please ignore this email.</p>
      </div>
    `,
  };

  await sendEmail(emailOptions);
};

/**
 * Send magic link for account verification
 * @param email - Recipient email address
 * @param token - Verification token
 * @param tempAccountId - Temporary account ID
 */
export const sendMagicLink = async (
  email: string,
  token: string,
  tempAccountId: string
): Promise<void> => {
  const verificationUrl = `${process.env.FRONTEND_URL}/verify?token=${token}&id=${tempAccountId}`;
  
  const emailOptions: EmailOptions = {
    from: process.env.EMAIL_FROM_ADDRESS || 'noreply@blissbite.com',
    to: email,
    subject: 'Complete your BlissBite registration',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Welcome to BlissBite!</h2>
        <p>Thank you for signing up. To complete your registration, please click the button below:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" style="background-color: #4CAF50; color: white; padding: 14px 20px; text-align: center; text-decoration: none; display: inline-block; border-radius: 4px; font-weight: bold;">
            Verify My Account
          </a>
        </div>
        <p>Or copy and paste this link into your browser:</p>
        <p style="word-break: break-all;">${verificationUrl}</p>
        <p>This link will expire in 60 minutes.</p>
        <p>If you did not request this verification, please ignore this email.</p>
      </div>
    `,
  };

  await sendEmail(emailOptions);
};

/**
 * Send welcome email after successful account verification
 * @param email - Recipient email address
 * @param name - User's name
 */
export const sendWelcomeEmail = async (
  email: string,
  name: string
): Promise<void> => {
  const emailOptions: EmailOptions = {
    from: process.env.EMAIL_FROM_ADDRESS || 'noreply@blissbite.com',
    to: email,
    subject: 'Welcome to BlissBite!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Welcome to BlissBite, ${name}!</h2>
        <p>Your account has been successfully verified and is now ready to use.</p>
        <p>You can now log in and start exploring all the features BlissBite has to offer.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.FRONTEND_URL}/login" style="background-color: #4CAF50; color: white; padding: 14px 20px; text-align: center; text-decoration: none; display: inline-block; border-radius: 4px; font-weight: bold;">
            Log In Now
          </a>
        </div>
        <p>Thank you for joining BlissBite!</p>
      </div>
    `,
  };

  await sendEmail(emailOptions);
};

// Export the email transporter for direct use in other modules
export { emailTransporter };
