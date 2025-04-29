"use strict";
/**
 * @file email.service.ts
 * @description Email service for sending verification emails and notifications
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendWelcomeEmail = exports.sendMagicLink = exports.sendVerificationCode = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const config_1 = require("../config");
// Configure email transport
const transporter = nodemailer_1.default.createTransport({
    host: config_1.config.email.host,
    port: config_1.config.email.port,
    secure: config_1.config.email.secure,
    auth: {
        user: config_1.config.email.user,
        pass: config_1.config.email.password,
    },
});
/**
 * Send verification code to user's email
 * @param email - Recipient email address
 * @param code - Verification code
 * @param tempAccountId - Temporary account ID
 */
const sendVerificationCode = (email, code, tempAccountId) => __awaiter(void 0, void 0, void 0, function* () {
    const mailOptions = {
        from: `"BlissBite" <${config_1.config.email.from}>`,
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
    try {
        yield transporter.sendMail(mailOptions);
        console.log(`Verification code sent to ${email}`);
    }
    catch (error) {
        console.error('Failed to send verification email:', error);
        throw new Error('Failed to send verification email');
    }
});
exports.sendVerificationCode = sendVerificationCode;
/**
 * Send magic link for account verification
 * @param email - Recipient email address
 * @param token - Verification token
 * @param tempAccountId - Temporary account ID
 */
const sendMagicLink = (email, token, tempAccountId) => __awaiter(void 0, void 0, void 0, function* () {
    const verificationUrl = `${config_1.config.frontend.url}/verify?token=${token}&id=${tempAccountId}`;
    const mailOptions = {
        from: `"BlissBite" <${config_1.config.email.from}>`,
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
    try {
        yield transporter.sendMail(mailOptions);
        console.log(`Magic link sent to ${email}`);
    }
    catch (error) {
        console.error('Failed to send magic link email:', error);
        throw new Error('Failed to send magic link email');
    }
});
exports.sendMagicLink = sendMagicLink;
/**
 * Send welcome email after successful account verification
 * @param email - Recipient email address
 * @param name - User's name
 */
const sendWelcomeEmail = (email, name) => __awaiter(void 0, void 0, void 0, function* () {
    const mailOptions = {
        from: `"BlissBite" <${config_1.config.email.from}>`,
        to: email,
        subject: 'Welcome to BlissBite!',
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Welcome to BlissBite, ${name}!</h2>
        <p>Your account has been successfully verified and is now ready to use.</p>
        <p>You can now log in and start exploring all the features BlissBite has to offer.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${config_1.config.frontend.url}/login" style="background-color: #4CAF50; color: white; padding: 14px 20px; text-align: center; text-decoration: none; display: inline-block; border-radius: 4px; font-weight: bold;">
            Log In Now
          </a>
        </div>
        <p>Thank you for joining BlissBite!</p>
      </div>
    `,
    };
    try {
        yield transporter.sendMail(mailOptions);
        console.log(`Welcome email sent to ${email}`);
    }
    catch (error) {
        console.error('Failed to send welcome email:', error);
        // Don't throw here as this is not critical
    }
});
exports.sendWelcomeEmail = sendWelcomeEmail;
