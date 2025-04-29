import { TypeORMContext } from '../../../middleware';

/**
 * @module account.controller
 * @description Controller module for handling account operations.
 * @module accounts
 */

/**
 * Retrieve a single account based on the accountId provided in the context parameters.
 *
 * @param {TypeORMContext} ctx - Koa context object extended with TypeORM functionality.
 */
export const getOne = async (ctx: TypeORMContext) => {
	const { accountId } = ctx.params;

	// Get repository by entity name
	const accountRepository = ctx.getRepository('Account');

	const account = await accountRepository.findOneBy({ id: accountId });

	ctx.assert(account, 404, "The requested account doesn't exist");
	ctx.status = 200;
	ctx.body = account;
};

/**
 * Update an account's details.
 *
 * @param {TypeORMContext} ctx - Koa context object extended with TypeORM functionality.
 */
export const updateOne = async (ctx: TypeORMContext) => {
	const { accountId } = ctx.params;
	const { forename, surname, accountType } = ctx.request.body;

	const accountRepository = ctx.getRepository('Account');
	const account = await accountRepository.findOneBy({ id: accountId });

	ctx.assert(account, 404, "The requested account doesn't exist");

	// Update allowed fields
	if (forename) account.forename = forename;
	if (surname) account.surname = surname;
	if (accountType) {
		// If changing to professional account, create the professional account record
		if (accountType === 'PROFESSIONAL' && account.accountType !== 'PROFESSIONAL') {
			const professionalAccountRepository = ctx.getRepository('ProfessionalAccount');
			const professionalAccount = professionalAccountRepository.create({
				account: account
			});
			await professionalAccountRepository.save(professionalAccount);
		}
		// If changing to personal account, delete the professional account record if it exists
		else if (accountType === 'PERSONAL' && account.accountType === 'PROFESSIONAL') {
			const professionalAccountRepository = ctx.getRepository('ProfessionalAccount');
			const professionalAccount = await professionalAccountRepository.findOne({
				where: { account: { id: account.id } }
			});
			if (professionalAccount) {
				await professionalAccountRepository.remove(professionalAccount);
			}
		}
		account.accountType = accountType;
	}

	const updatedAccount = await accountRepository.save(account);

	ctx.status = 200;
	ctx.body = updatedAccount;
};

/**
 * Retrieve all accounts.
 *
 * @param {TypeORMContext} ctx - Koa context object extended with TypeORM functionality.
 */
export const getAll = async (ctx: TypeORMContext) => {
	// Get the account repository by name
	const accountRepository = ctx.getRepository('Account');

	// Find all accounts
	const accounts = await accountRepository.find({
		order: { created_at: 'DESC' }
	});

	ctx.status = 200;
	ctx.body = accounts;
};

/**
 * Create a new account using the provided data in the request body.
 *
 * @param {TypeORMContext} ctx - Koa context object extended with TypeORM functionality.
 */
export const createOne = async (ctx: TypeORMContext) => {
	const { name } = ctx.request.body;
	ctx.assert(name, 400, 'The account info is malformed!');

	// Get the account repository by name
	const accountRepository = ctx.getRepository('Account');

	// Create a new account
	const newAccount = accountRepository.create({
		name,
		created_at: Date.now()
	});

	// Save the new account
	const createdAccount = await accountRepository.save(newAccount);

	ctx.status = 201;
	ctx.body = createdAccount;
};

/**
 * Delete an account by accountId.
 *
 * @param {TypeORMContext} ctx - Koa context object extended with TypeORM functionality.
 */
export const deleteOne = async (ctx: TypeORMContext) => {
	const { accountId } = ctx.params;
	const accountRepository = ctx.getRepository('Account');
	const sessionRepository = ctx.getRepository('Session');
	const verificationRepository = ctx.getRepository('AccountVerification');
	const orderRepository = ctx.getRepository('Order');
	const reviewRepository = ctx.getRepository('Review');
	const favoriteRepository = ctx.getRepository('Favorite');
	const professionalAccountRepository = ctx.getRepository('ProfessionalAccount');
	const personalAccountRepository = ctx.getRepository('PersonalAccount');

	const account = await accountRepository.findOne({
		where: { id: accountId },
		relations: ['status', 'professionalAccount', 'personalAccount']
	});
	ctx.assert(account, 404, "The requested account doesn't exist");

	// Delete all related entities first
	await sessionRepository.delete({ account: { id: accountId } });
	await verificationRepository.delete({ account: { id: accountId } });
	await orderRepository.delete({ account: { id: accountId } });
	await reviewRepository.delete({ account: { id: accountId } });
	await favoriteRepository.delete({ account: { id: accountId } });

	// Delete professional or personal account if they exist
	if (account.professionalAccount) {
		await professionalAccountRepository.delete({ id: account.professionalAccount.id });
	}
	if (account.personalAccount) {
		await personalAccountRepository.delete({ id: account.personalAccount.id });
	}

	// Finally delete the account (this will cascade delete the status)
	await accountRepository.delete({ id: accountId });

	ctx.status = 204;
};
