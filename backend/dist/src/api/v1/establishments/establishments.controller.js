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
exports.deleteOne = exports.updateOne = exports.createOne = exports.getOne = exports.getAll = void 0;
/**
 * Get all establishments for the current professional account
 */
const getAll = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const accountId = ctx.state.account.id;
    const page = parseInt(ctx.query.page) || 1;
    const limit = parseInt(ctx.query.limit) || 9;
    const establishmentRepository = ctx.getRepository('Establishment');
    const professionalAccountRepository = ctx.getRepository('ProfessionalAccount');
    // Get the professional account
    const professionalAccount = yield professionalAccountRepository.findOne({
        where: { account: { id: accountId } }
    });
    if (!professionalAccount) {
        ctx.throw(403, 'Only professional accounts can access establishments');
        return;
    }
    // Get total count of establishments
    const [establishments, total] = yield establishmentRepository.findAndCount({
        where: { professionalAccount: { id: professionalAccount.id } },
        skip: (page - 1) * limit,
        take: limit,
        order: { created_at: 'DESC' }
    });
    const totalPages = Math.ceil(total / limit);
    ctx.status = 200;
    ctx.body = {
        establishments,
        pagination: {
            currentPage: page,
            limit,
            totalItems: total,
            totalPages
        }
    };
});
exports.getAll = getAll;
/**
 * Get a single establishment by ID
 */
const getOne = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { establishmentId } = ctx.params;
    const accountId = ctx.state.account.id;
    const establishmentRepository = ctx.getRepository('Establishment');
    const professionalAccountRepository = ctx.getRepository('ProfessionalAccount');
    // Get the professional account
    const professionalAccount = yield professionalAccountRepository.findOne({
        where: { account: { id: accountId } }
    });
    if (!professionalAccount) {
        ctx.throw(403, 'Only professional accounts can access establishments');
        return;
    }
    // Get the establishment and verify ownership
    const establishment = yield establishmentRepository.findOne({
        where: {
            id: establishmentId,
            professionalAccount: { id: professionalAccount.id }
        },
        relations: [
            'products',
            'products.categories',
            'products.categories.category'
        ]
    });
    if (!establishment) {
        ctx.throw(404, 'Establishment not found or you do not have permission to access it');
        return;
    }
    // Transform the products to include category names
    const transformedEstablishment = Object.assign(Object.assign({}, establishment), { products: (_a = establishment.products) === null || _a === void 0 ? void 0 : _a.map((product) => {
            var _a;
            return (Object.assign(Object.assign({}, product), { categories: (_a = product.categories) === null || _a === void 0 ? void 0 : _a.map((pc) => ({
                    id: pc.category.id,
                    name: pc.category.name
                })) }));
        }) });
    ctx.status = 200;
    ctx.body = transformedEstablishment;
});
exports.getOne = getOne;
/**
 * Create a new establishment
 */
const createOne = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const accountId = ctx.state.account.id;
    const { name, address, description, avatar, banner } = ctx.request.body;
    const establishmentRepository = ctx.getRepository('Establishment');
    const professionalAccountRepository = ctx.getRepository('ProfessionalAccount');
    // Get the professional account
    const professionalAccount = yield professionalAccountRepository.findOne({
        where: { account: { id: accountId } }
    });
    if (!professionalAccount) {
        ctx.throw(403, 'Only professional accounts can create establishments');
        return;
    }
    // Create the establishment
    const establishment = establishmentRepository.create({
        name,
        address,
        description,
        avatar,
        banner,
        professionalAccount
    });
    yield establishmentRepository.save(establishment);
    ctx.status = 201;
    ctx.body = establishment;
});
exports.createOne = createOne;
/**
 * Update an establishment
 */
const updateOne = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const { establishmentId } = ctx.params;
    const accountId = ctx.state.account.id;
    const { name, address, description, status, avatar, banner } = ctx.request.body;
    const establishmentRepository = ctx.getRepository('Establishment');
    const professionalAccountRepository = ctx.getRepository('ProfessionalAccount');
    // Get the professional account
    const professionalAccount = yield professionalAccountRepository.findOne({
        where: { account: { id: accountId } }
    });
    if (!professionalAccount) {
        ctx.throw(403, 'Only professional accounts can update establishments');
        return;
    }
    // Get the establishment and verify ownership
    const establishment = yield establishmentRepository.findOne({
        where: {
            id: establishmentId,
            professionalAccount: { id: professionalAccount.id }
        }
    });
    if (!establishment) {
        ctx.throw(404, 'Establishment not found or you do not have permission to update it');
        return;
    }
    // Update allowed fields
    if (name)
        establishment.name = name;
    if (address)
        establishment.address = address;
    if (description !== undefined)
        establishment.description = description;
    if (status)
        establishment.status = status;
    if (avatar !== undefined)
        establishment.avatar = avatar;
    if (banner !== undefined)
        establishment.banner = banner;
    const updatedEstablishment = yield establishmentRepository.save(establishment);
    ctx.status = 200;
    ctx.body = updatedEstablishment;
});
exports.updateOne = updateOne;
/**
 * Delete an establishment
 */
const deleteOne = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const { establishmentId } = ctx.params;
    const accountId = ctx.state.account.id;
    const establishmentRepository = ctx.getRepository('Establishment');
    const professionalAccountRepository = ctx.getRepository('ProfessionalAccount');
    // Get the professional account
    const professionalAccount = yield professionalAccountRepository.findOne({
        where: { account: { id: accountId } }
    });
    if (!professionalAccount) {
        ctx.throw(403, 'Only professional accounts can delete establishments');
        return;
    }
    // Get the establishment and verify ownership
    const establishment = yield establishmentRepository.findOne({
        where: {
            id: establishmentId,
            professionalAccount: { id: professionalAccount.id }
        }
    });
    if (!establishment) {
        ctx.throw(404, 'Establishment not found or you do not have permission to delete it');
        return;
    }
    yield establishmentRepository.remove(establishment);
    ctx.status = 204;
});
exports.deleteOne = deleteOne;
