/**
 * @file authentication.controller.ts
 * @description Controller handling HTTP requests for authentication flows.
 * Contains business logic and interacts directly with TypeORM via context.
 */

import { randomBytes } from 'crypto';
import Keyv from 'keyv';
import { TypeORMContext } from '../../../middleware';
import { TempSignupData, CompleteSignupRequest } from './authentication.types';
import { Scrypt } from '../../../utils';
import { config } from '../../../config';
import {
	sendVerificationCode,
	sendMagicLink,
	sendWelcomeEmail
} from '../../../services/email.service';
import { AccountStatus } from '../../../entities/account/account.status.entity';
import { Session } from '../../../entities/authentication/authentication.session.entity';

// --- Keyv Store Initialization ---
const keyvTempSignup = new Keyv({ namespace: 'temp_signup' });
const keyvVerificationCodes = new Keyv({ namespace: 'verification_codes' });
const keyvVerificationTokens = new Keyv({ namespace: 'verification_tokens' });

// Constants from config
const SESSION_COOKIE_NAME = config.auth.sessionCookieName;
const TEMP_SIGNUP_DATA_TTL = config.auth.tempAccountTTL;
const VERIFICATION_CODE_TTL = config.auth.verificationCodeTTL;
const MAGIC_LINK_TOKEN_TTL = config.auth.magicLinkTTL;

// === Helper Functions ===

/**
 * Hashes a password using the project's Scrypt utility.
 * @param password - Plaintext password.
 * @returns Hashed password in format "salt:hash".
 */
const hashPassword = (password: string): string => {
	const scrypt = new Scrypt(password);
	return scrypt.combined;
};

/**
 * Verifies a password against stored hash using the project's Scrypt utility.
 * @param storedHash - Stored hash in "salt:hash" format.
 * @param providedPass - Plaintext password to verify.
 * @returns True if password matches hash.
 * @throws Error if stored hash format is invalid.
 */
const verifyPassword = (storedHash: string, providedPass: string): boolean => {
	console.log(storedHash, providedPass);

	const [salt, hash] = storedHash.split(':');
	if (!salt || !hash) {
		throw new Error('Invalid stored password format.');
	}
	return Scrypt.compare(providedPass, salt, hash);
};

/**
 * Creates a session for the user and sets the session cookie.
 * @param ctx - Koa context (TypeORM enabled).
 * @param accountId - ID of the authenticated account.
 */
const createSessionAndSetCookie = async (
	ctx: TypeORMContext,
	accountId: string
): Promise<void> => {
	const accountRepository = ctx.getRepository('Account');
	const account = await accountRepository.findOneBy({ id: accountId });

	if (!account) {
		ctx.throw(404, 'Account not found');
	}

	// Set session data
	ctx.session.account = {
		id: account.id,
		email: account.email,
		forename: account.forename,
		surname: account.surname,
		accountType: account.accountType
	};

	// Save session
	await ctx.session.save();
};

/**
 * Validates a session token.
 * @param ctx - Koa context (TypeORM enabled).
 * @param sessionToken - The session token to validate.
 * @returns The account ID if the session is valid, otherwise null.
 */
const validateSession = async (
	ctx: TypeORMContext,
	sessionToken: string
): Promise<string | null> => {
	if (!sessionToken) return null;

	const sessionRepository = ctx.getRepository('Session');
	const session = await sessionRepository.findOne({
		where: { session_token: sessionToken },
		relations: ['account']
	});

	if (!session || session.expires_at < new Date() || !session.account) {
		if (session) await sessionRepository.remove(session);
		return null;
	}

	return session.account.id;
};

/**
 * Deletes a session (logout).
 * @param ctx - Koa context (TypeORM enabled).
 */
const deleteSession = async (ctx: TypeORMContext): Promise<void> => {
	// Get the session token from the cookie
	const sessionToken = ctx.cookies.get(SESSION_COOKIE_NAME);
	
	if (sessionToken) {
		// Delete the session from the database
		const sessionRepository = ctx.getRepository('Session');
		await sessionRepository.delete({ session_token: sessionToken });
	}
	
	// Clear the session data
	ctx.session = null;
};

// === Controller Endpoints ===

/**
 * POST /signup/start
 * Handles the initial step of user signup (email/password/name).
 * Creates a temporary account that will be upgraded after verification.
 */
export const signupStart = async (ctx: TypeORMContext): Promise<void> => {
	const { email, password, forename, surname, tempAccountId, resendCode } = ctx
		.request.body as any;

	// Handle resending verification code for existing temporary account
	if (resendCode && tempAccountId && email) {
		try {
			// Check if we have this temp account ID
			const tempSignupData = (await keyvTempSignup.get(
				tempAccountId
			)) as TempSignupData;

			if (!tempSignupData || tempSignupData.email !== email) {
				ctx.throw(404, 'Temporary account not found or expired.');
				return;
			}

			// Generate new verification code
			const verificationCode = randomBytes(3).toString('hex').toUpperCase(); // 6-char code
			await keyvVerificationCodes.set(
				tempAccountId,
				verificationCode,
				VERIFICATION_CODE_TTL
			);

			// Send verification code via email
			try {
				await sendVerificationCode(email, verificationCode, tempAccountId);
			} catch (emailError) {
				console.error('Failed to send verification email:', emailError);
				// Log but don't fail the request
			}
			console.log(
				`Resending verification code for ${email}. TempID: ${tempAccountId}, Code: ${verificationCode}`
			);

			ctx.status = 200;
			ctx.body = {
				message: 'Verification code resent. Please check your email.',
				tempAccountId
			};
			return;
		} catch (error: any) {
			console.error('Resend verification code error:', error);
			ctx.throw(500, error.message || 'Failed to resend verification code.');
			return;
		}
	}

	// Normal signup flow - create new temporary account
	if (!email || !password) {
		ctx.throw(400, 'Email and password are required.');
		return;
	}

	// Check if account already exists
	const accountRepository = ctx.getRepository('Account');
	const existingAccount = await accountRepository.findOneBy({ email });

	if (existingAccount) {
		ctx.throw(409, 'An account with this email already exists.');
		return;
	}

	try {
		const hashedPassword = hashPassword(password);
		const tempAccountId = `temp_${randomBytes(16).toString('hex')}`;

		// Generate verification code first
		const verificationCode = randomBytes(3).toString('hex').toUpperCase(); // 6-char code

		// Create new account with correct field name
		const account = accountRepository.create({
			email,
			password_hash: hashedPassword,
			forename,
			surname,
			accountType: 'PERSONAL'
		});

		await accountRepository.save(account);

		// Create email verification record
		const verificationRepository = ctx.getRepository('AccountVerification');
		const verification = verificationRepository.create({
			account: account,
			method: 'EMAIL'
		});
		await verificationRepository.save(verification);

		// Store additional temporary data using Keyv
		const signupData: TempSignupData = {
			email,
			hashedPassword,
			forename: forename || '',
			surname: surname || '',
			accountId: account.id,
			expiresAt: Date.now() + TEMP_SIGNUP_DATA_TTL
		};

		// Store temporary data using Keyv
		await keyvTempSignup.set(tempAccountId, signupData, TEMP_SIGNUP_DATA_TTL);

		// Store verification code
		await keyvVerificationCodes.set(
			tempAccountId,
			verificationCode,
			VERIFICATION_CODE_TTL
		);

		// Send verification code via email
		try {
			await sendVerificationCode(email, verificationCode, tempAccountId);
		} catch (emailError) {
			console.error('Failed to send verification email:', emailError);
			// Log but don't fail the request
		}
		console.log(
			`Signup started for ${email}. TempID: ${tempAccountId}, Code: ${verificationCode}`
		);

		ctx.status = 201;
		ctx.body = {
			tempAccountId,
			accountId: account.id
		};
	} catch (error: any) {
		console.error('Signup start error:', error);
		ctx.throw(500, error.message || 'Failed to start signup process.');
	}
};

/**
 * POST /verify-email/:code
 * Verifies the email using the provided code.
 * Returns a verification token that will be used to complete the signup process.
 */
export const verifyEmailCode = async (ctx: TypeORMContext): Promise<void> => {
	const code = ctx.params.code;
	const { tempAccountId, accountId } = ctx.request.body as any;

	if (!tempAccountId || !accountId || !code) {
		ctx.throw(400, 'Temporary account ID, account ID, and verification code are required.');
		return;
	}

	try {
		// Retrieve stored code and temp data
		const storedCode = await keyvVerificationCodes.get(tempAccountId);
		const tempSignupData = (await keyvTempSignup.get(tempAccountId)) as TempSignupData;

		if (!storedCode || !tempSignupData) {
			console.log('Verification failed - missing data:', {
				hasStoredCode: !!storedCode,
				hasTempData: !!tempSignupData
			});
			ctx.throw(404, 'Verification request not found or expired.');
			
			return;
		}

		// Convert both codes to uppercase for case-insensitive comparison
		if (storedCode.toUpperCase() !== code.toUpperCase()) {
			ctx.throw(400, 'Invalid verification code.');

			return;
		}

		// Verification successful - Generate verification token
		const verificationToken = `verify_${randomBytes(32).toString('hex')}`;

		// Send magic link email for completing signup
		try {
			await sendMagicLink(tempSignupData.email, verificationToken, tempAccountId);
		} catch (emailError) {
			console.error('Failed to send magic link email:', emailError);
			// Log but don't fail the request
		}

		// Store the verification token with the temp account ID
		await keyvVerificationTokens.set(tempAccountId, verificationToken, MAGIC_LINK_TOKEN_TTL);

		// Clean up verification code as it's been used
		await keyvVerificationCodes.delete(tempAccountId);

		ctx.status = 200;
		ctx.body = {
			success: true,
			message: 'Email verification successful.',
			token: verificationToken
		};
	} catch (error: any) {
		console.error('Email verification error:', error);
		if (error.status) {
			ctx.throw(error.status, error.message);
		} else {
			ctx.throw(500, error.message || 'Failed to verify email.');
		}
	}
};

/**
 * POST /login
 * Handles user login with email and password.
 */
export const login = async (ctx: TypeORMContext): Promise<void> => {
	const { email, password } = ctx.request.body as any;

	if (!email || !password) {
		ctx.throw(400, 'Email and password are required.');
		return;
	}

	try {
		const accountRepository = ctx.getRepository('Account');
		// Use string identifier instead of direct entity reference to avoid circular dependencies
		const accountStatusRepository = ctx.getRepository('AccountStatus');

		// Get the account with its status
		const account = await accountRepository.findOne({
			where: { email },
			relations: ['status']
		});

		console.log('Login attempt:', {
			email,
			accountFound: !!account,
			hasStatus: account?.status ? true : false,
			status: account?.status?.status
		});
		console.log(account);	

		if (!account) {
			ctx.throw(401, 'Invalid email or password.');
			return;
		}

		// Check account status
		if (!account.status) {
			ctx.throw(403, 'Account has no status');
			return;
		}

		if (account.status.status === 'SUSPENDED') {
			ctx.throw(403, 'Account is suspended');
			return;
		}

		if (account.status.status === 'SOFT_DELETED') {
			ctx.throw(403, 'Account no longer exists');
			return;
		}

		// Check if account has verified email
		const verificationRepository = ctx.getRepository('AccountVerification');
		const emailVerification = await verificationRepository.findOne({
			where: {
				account: { id: account.id },
				method: 'EMAIL',
			}
		});

		if (!emailVerification) {
			ctx.throw(403, 'Account not verified');
			return;
		}

		// Verify password
		if (!verifyPassword(account.password_hash, password)) {
			ctx.throw(401, 'Invalid email or password.');
			return;
		}

		// Login successful - Create session
		await createSessionAndSetCookie(ctx, account.id);

		// Return complete account information
		ctx.status = 200;
		ctx.body = {
			account: {
				id: account.id,
				email: account.email,
				forename: account.forename,
				surname: account.surname,
				accountType: account.accountType,
				status: account.status,
				verifications: [{
					method: 'EMAIL',
					verified_at: emailVerification.verified_at
				}]
			},
			sessionToken: ctx.session.account.session_token
		};
	} catch (error: any) {
		console.error('Login error:', error);
		if (error.status) {
			ctx.throw(error.status, error.message);
		} else {
			ctx.throw(500, error.message || 'Login failed.');
		}
	}
};

/**
 * POST /logout
 * Handles user logout by clearing the session cookie and deleting the session.
 */
export const logout = async (ctx: TypeORMContext): Promise<void> => {
	await deleteSession(ctx);

	// Clear the cookie
	ctx.cookies.set(SESSION_COOKIE_NAME, null, { maxAge: 0 });

	ctx.status = 200;
	ctx.body = { message: 'Logout successful.' };
};

/**
 * GET /me
 * Retrieves the current authenticated user's information based on the session.
 */
export const getCurrentUser = async (ctx: TypeORMContext): Promise<void> => {
	const sessionToken = ctx.cookies.get(SESSION_COOKIE_NAME);
	const accountId = await validateSession(ctx, sessionToken || '');

	if (!accountId) {
		ctx.throw(401, 'Not authenticated or session expired.');
		return;
	}

	try {
		const accountRepository = ctx.getRepository('Account');
		const account = await accountRepository.findOne({
			where: { id: accountId },
			select: [
				'id',
				'email',
				'name',
				'createdAt',
				'updatedAt',
				'isEmailVerified'
			]
			// relations: ['status', 'type'] // If needed
		});

		if (!account) {
			ctx.throw(404, 'Authenticated user not found.');
			return;
		}

		ctx.status = 200;
		ctx.body = { account };
	} catch (error: any) {
		console.error('Get current user error:', error);
		if (error.status) {
			ctx.throw(error.status, error.message);
		} else {
			ctx.throw(500, error.message || 'Failed to retrieve user information.');
		}
	}
};

/**
 * POST /signup/complete
 * Completes the signup process after email verification.
 * Converts the temporary account to a permanent one.
 */
export const completeSignup = async (ctx: TypeORMContext): Promise<void> => {
	const { tempAccountId, verificationToken, forename, surname } = ctx.request
		.body as CompleteSignupRequest;

	if (!tempAccountId || !verificationToken) {
		ctx.throw(400, 'Temporary account ID and verification token are required.');
		return;
	}

	try {
		// Verify the token is valid
		const storedToken = await keyvVerificationTokens.get(tempAccountId);
		if (!storedToken || storedToken !== verificationToken) {
			ctx.throw(401, 'Invalid or expired verification token.');
			return;
		}

		// Get temp account data
		const tempSignupData = (await keyvTempSignup.get(
			tempAccountId
		)) as TempSignupData;
		if (!tempSignupData) {
			ctx.throw(404, 'Temporary account not found or expired');
			return;
		}

		const accountRepository = ctx.getRepository('Account');
		const accountStatusRepository = ctx.getRepository('AccountStatus');

		// Get the existing account created during signup start
		const account = await accountRepository.findOne({
			where: { id: tempSignupData.accountId },
			relations: ['status']
		});

		if (!account) {
			ctx.throw(404, 'Account not found');
			return;
		}

		// Update the account
		account.forename = forename || tempSignupData.forename;
		account.surname = surname || tempSignupData.surname;

		// Mark email verification as complete
		const verificationRepository = ctx.getRepository('AccountVerification');
		const emailVerification = await verificationRepository.findOne({
			where: {
				account: { id: account.id },
				method: 'EMAIL'
			}
		});

		if (emailVerification) {
			emailVerification.verified_at = new Date();
			await verificationRepository.save(emailVerification);
		}

		// Create ACTIVE status record since signup is now complete
		const newStatus = accountStatusRepository.create({
			account: account,
			status: 'ACTIVE',
			reason: 'Account verified via email'
		});
		await accountStatusRepository.save(newStatus);

		// Associate the status with the account
		account.status = newStatus;
		await accountRepository.save(account);

		// Ensure the account has the status relation loaded
		const updatedAccount = await accountRepository.findOne({
			where: { id: account.id },
			relations: ['status']
		});

		// Cleanup temp data
		await keyvTempSignup.delete(tempAccountId);
		await keyvVerificationTokens.delete(tempAccountId);

		// Create session
		await createSessionAndSetCookie(ctx, account.id);

		// Send welcome email
		try {
			await sendWelcomeEmail(account.email, account.forename);
		} catch (emailError) {
			console.error('Failed to send welcome email:', emailError);
		}

		ctx.status = 200;
		ctx.body = {
			message: 'Account successfully created',
			account: {
				id: account.id,
				email: account.email,
				forename: account.forename,
				surname: account.surname
			}
		};
	} catch (error: any) {
		console.error('Complete signup error:', error);
		if (error.status) {
			ctx.throw(error.status, error.message);
		} else {
			ctx.throw(500, error.message || 'Failed to complete signup.');
		}
	}
};

// Additional endpoints can be added following the same pattern
