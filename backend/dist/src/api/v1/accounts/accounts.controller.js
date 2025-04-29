"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteOne = exports.createOne = exports.getAll = exports.updateOne = exports.getOne = void 0;
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
const getOne = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const { accountId } = ctx.params;
    // Get repository by entity name
    const accountRepository = ctx.getRepository('Account');
    const account = yield accountRepository.findOneBy({ id: accountId });
    ctx.assert(account, 404, "The requested account doesn't exist");
    ctx.status = 200;
    ctx.body = account;
});
exports.getOne = getOne;
/**
 * Update an account's details.
 *
 * @param {TypeORMContext} ctx - Koa context object extended with TypeORM functionality.
 */
const updateOne = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const { accountId } = ctx.params;
    const { forename, surname, accountType } = ctx.request.body;
    const accountRepository = ctx.getRepository('Account');
    const account = yield accountRepository.findOneBy({ id: accountId });
    ctx.assert(account, 404, "The requested account doesn't exist");
    // Update allowed fields
    if (forename)
        account.forename = forename;
    if (surname)
        account.surname = surname;
    if (accountType) {
        // If changing to professional account, create the professional account record
        if (accountType === 'PROFESSIONAL' && account.accountType !== 'PROFESSIONAL') {
            const professionalAccountRepository = ctx.getRepository('ProfessionalAccount');
            const professionalAccount = professionalAccountRepository.create({
                account: account
            });
            yield professionalAccountRepository.save(professionalAccount);
        }
        // If changing to personal account, delete the professional account record if it exists
        else if (accountType === 'PERSONAL' && account.accountType === 'PROFESSIONAL') {
            const professionalAccountRepository = ctx.getRepository('ProfessionalAccount');
            const professionalAccount = yield professionalAccountRepository.findOne({
                where: { account: { id: account.id } }
            });
            if (professionalAccount) {
                yield professionalAccountRepository.remove(professionalAccount);
            }
        }
        account.accountType = accountType;
    }
    const updatedAccount = yield accountRepository.save(account);
    ctx.status = 200;
    ctx.body = updatedAccount;
});
exports.updateOne = updateOne;
/**
 * Retrieve all accounts.
 *
 * @param {TypeORMContext} ctx - Koa context object extended with TypeORM functionality.
 */
const getAll = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    // Get the account repository by name
    const accountRepository = ctx.getRepository('Account');
    // Find all accounts
    const accounts = yield accountRepository.find({
        order: { created_at: 'DESC' }
    });
    ctx.status = 200;
    ctx.body = accounts;
});
exports.getAll = getAll;
/**
 * Create a new account using the provided data in the request body.
 *
 * @param {TypeORMContext} ctx - Koa context object extended with TypeORM functionality.
 */
const createOne = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
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
    const createdAccount = yield accountRepository.save(newAccount);
    ctx.status = 201;
    ctx.body = createdAccount;
});
exports.createOne = createOne;
/**
 * Delete an account by accountId.
 *
 * @param {TypeORMContext} ctx - Koa context object extended with TypeORM functionality.
 */
const deleteOne = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const { accountId } = ctx.params;
    const accountRepository = ctx.getRepository('Account');
    const sessionRepository = ctx.getRepository('Session');
    const verificationRepository = ctx.getRepository('AccountVerification');
    const orderRepository = ctx.getRepository('Order');
    const reviewRepository = ctx.getRepository('Review');
    const favoriteRepository = ctx.getRepository('Favorite');
    const professionalAccountRepository = ctx.getRepository('ProfessionalAccount');
    const personalAccountRepository = ctx.getRepository('PersonalAccount');
    const account = yield accountRepository.findOne({
        where: { id: accountId },
        relations: ['status', 'professionalAccount', 'personalAccount']
    });
    ctx.assert(account, 404, "The requested account doesn't exist");
    // Delete all related entities first
    yield sessionRepository.delete({ account: { id: accountId } });
    yield verificationRepository.delete({ account: { id: accountId } });
    yield orderRepository.delete({ account: { id: accountId } });
    yield reviewRepository.delete({ account: { id: accountId } });
    yield favoriteRepository.delete({ account: { id: accountId } });
    // Delete professional or personal account if they exist
    if (account.professionalAccount) {
        yield professionalAccountRepository.delete({ id: account.professionalAccount.id });
    }
    if (account.personalAccount) {
        yield personalAccountRepository.delete({ id: account.personalAccount.id });
    }
    // Finally delete the account (this will cascade delete the status)
    yield accountRepository.delete({ id: accountId });
    ctx.status = 204;
});
exports.deleteOne = deleteOne;
