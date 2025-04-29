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
exports.deleteOne = exports.updateOne = exports.getAll = exports.createOne = void 0;
/**
 * Create a new product for an establishment
 */
const createOne = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const { establishmentId } = ctx.params;
    const accountId = ctx.state.account.id;
    const productData = ctx.request.body;
    const productRepository = ctx.getRepository('Product');
    const establishmentRepository = ctx.getRepository('Establishment');
    const professionalAccountRepository = ctx.getRepository('ProfessionalAccount');
    // Get the professional account
    const professionalAccount = yield professionalAccountRepository.findOne({
        where: { account: { id: accountId } }
    });
    if (!professionalAccount) {
        ctx.throw(403, 'Only professional accounts can create products');
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
        ctx.throw(404, 'Establishment not found or you do not have permission to add products to it');
        return;
    }
    // Create the product
    const product = productRepository.create(Object.assign(Object.assign({}, productData), { establishment }));
    yield productRepository.save(product);
    ctx.status = 201;
    ctx.body = product;
});
exports.createOne = createOne;
/**
 * Get all products for an establishment
 */
const getAll = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const { establishmentId } = ctx.params;
    const accountId = ctx.state.account.id;
    const productRepository = ctx.getRepository('Product');
    const establishmentRepository = ctx.getRepository('Establishment');
    const professionalAccountRepository = ctx.getRepository('ProfessionalAccount');
    // Get the professional account
    const professionalAccount = yield professionalAccountRepository.findOne({
        where: { account: { id: accountId } }
    });
    if (!professionalAccount) {
        ctx.throw(403, 'Only professional accounts can access products');
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
        ctx.throw(404, 'Establishment not found or you do not have permission to access its products');
        return;
    }
    // Parse filters from query
    const { minPrice, maxPrice, category, availableOnly, sortBy = 'price', order = 'asc', search } = ctx.query;
    // Start building the query
    let qb = productRepository
        .createQueryBuilder('product')
        .leftJoinAndSelect('product.categories', 'productCategory')
        .leftJoinAndSelect('productCategory.category', 'category')
        .where('product.establishment_id = :establishmentId', { establishmentId });
    // Min price
    if (minPrice !== undefined && minPrice !== '') {
        qb = qb.andWhere('product.base_price >= :minPrice', { minPrice: Number(minPrice) });
    }
    // Max price
    if (maxPrice !== undefined && maxPrice !== '') {
        qb = qb.andWhere('product.base_price <= :maxPrice', { maxPrice: Number(maxPrice) });
    }
    // Category (by id or name)
    if (category) {
        qb = qb.andWhere('(category.id = :category OR category.name = :category)', { category });
    }
    // Available only
    if (String(availableOnly) === 'true') {
        qb = qb.andWhere('product.is_available = true');
    }
    // Search (name or description)
    if (search) {
        qb = qb.andWhere('(product.name ILIKE :search OR product.description ILIKE :search)', { search: `%${search}%` });
    }
    // Ensure sortBy and order are strings (not arrays)
    const sortByStr = Array.isArray(sortBy) ? sortBy[0] : sortBy;
    let orderStr = Array.isArray(order) ? order[0] : order;
    if (!orderStr)
        orderStr = 'asc';
    orderStr = typeof orderStr === 'string' ? orderStr.toUpperCase() : 'ASC';
    // Sorting
    if (sortByStr === 'rating') {
        // Sort by average rating (need subquery)
        qb = qb
            .leftJoin((subqb) => subqb
            .select('review.reviewable_id', 'productId')
            .addSelect('AVG(review.rating)', 'avgRating')
            .from('review', 'review')
            .where("review.reviewable_type_id = (SELECT id FROM reviewable_type_lookup WHERE name = 'Product')")
            .groupBy('review.reviewable_id'), 'reviewAvg', 'reviewAvg.productId = product.id')
            .addSelect('COALESCE(reviewAvg.avgRating, 0)', 'avgRating')
            .orderBy('avgRating', orderStr === 'DESC' ? 'DESC' : 'ASC');
    }
    else if (sortByStr === 'popularity') {
        // Sort by order count (need subquery)
        qb = qb
            .leftJoin((subqb) => subqb
            .select('orderProduct.product_id', 'productId')
            .addSelect('COUNT(orderProduct.id)', 'orderCount')
            .from('order_product', 'orderProduct')
            .groupBy('orderProduct.product_id'), 'popularity', 'popularity.productId = product.id')
            .addSelect('COALESCE(popularity.orderCount, 0)', 'orderCount')
            .orderBy('orderCount', orderStr === 'DESC' ? 'DESC' : 'ASC');
    }
    else {
        // Default: sort by price or any other product field
        qb = qb.orderBy(`product.base_price`, orderStr === 'DESC' ? 'DESC' : 'ASC');
    }
    // Execute query
    const products = yield qb.getMany();
    ctx.status = 200;
    ctx.body = products;
});
exports.getAll = getAll;
/**
 * Update a product
 */
const updateOne = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const { establishmentId, productId } = ctx.params;
    const accountId = ctx.state.account.id;
    const productData = ctx.request.body;
    const productRepository = ctx.getRepository('Product');
    const establishmentRepository = ctx.getRepository('Establishment');
    const professionalAccountRepository = ctx.getRepository('ProfessionalAccount');
    // Get the professional account
    const professionalAccount = yield professionalAccountRepository.findOne({
        where: { account: { id: accountId } }
    });
    if (!professionalAccount) {
        ctx.throw(403, 'Only professional accounts can update products');
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
        ctx.throw(404, 'Establishment not found or you do not have permission to update its products');
        return;
    }
    // Get the product and verify it belongs to the establishment
    const product = yield productRepository.findOne({
        where: {
            id: productId,
            establishment: { id: establishmentId }
        }
    });
    if (!product) {
        ctx.throw(404, 'Product not found or you do not have permission to update it');
        return;
    }
    // Update the product
    Object.assign(product, productData);
    const updatedProduct = yield productRepository.save(product);
    ctx.status = 200;
    ctx.body = updatedProduct;
});
exports.updateOne = updateOne;
/**
 * Delete a product
 */
const deleteOne = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const { establishmentId, productId } = ctx.params;
    const accountId = ctx.state.account.id;
    const productRepository = ctx.getRepository('Product');
    const establishmentRepository = ctx.getRepository('Establishment');
    const professionalAccountRepository = ctx.getRepository('ProfessionalAccount');
    // Get the professional account
    const professionalAccount = yield professionalAccountRepository.findOne({
        where: { account: { id: accountId } }
    });
    if (!professionalAccount) {
        ctx.throw(403, 'Only professional accounts can delete products');
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
        ctx.throw(404, 'Establishment not found or you do not have permission to delete its products');
        return;
    }
    // Get the product and verify it belongs to the establishment
    const product = yield productRepository.findOne({
        where: {
            id: productId,
            establishment: { id: establishmentId }
        }
    });
    if (!product) {
        ctx.throw(404, 'Product not found or you do not have permission to delete it');
        return;
    }
    yield productRepository.remove(product);
    ctx.status = 204;
});
exports.deleteOne = deleteOne;
