import { TypeORMContext } from '../../../middleware';
import { Establishment } from '../../../entities/establishment/establishment.entity';
import { Product } from '../../../entities/product/product.entity';
import { ProductCategory } from '../../../entities/product/product.category.entity';

/**
 * Get all establishments for the current professional account
 */
export const getAll = async (ctx: TypeORMContext) => {
	const accountId = ctx.state.account.id;
	const page = parseInt(ctx.query.page as string) || 1;
	const limit = parseInt(ctx.query.limit as string) || 9;
	const establishmentRepository = ctx.getRepository('Establishment');
	const professionalAccountRepository = ctx.getRepository('ProfessionalAccount');

	// Get the professional account
	const professionalAccount = await professionalAccountRepository.findOne({
		where: { account: { id: accountId } }
	});

	if (!professionalAccount) {
		ctx.throw(403, 'Only professional accounts can access establishments');
		return;
	}

	// Get total count of establishments
	const [establishments, total] = await establishmentRepository.findAndCount({
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
};

/**
 * Get a single establishment by ID
 */
export const getOne = async (ctx: TypeORMContext) => {
	const { establishmentId } = ctx.params;
	const accountId = ctx.state.account.id;
	const establishmentRepository = ctx.getRepository('Establishment');
	const professionalAccountRepository = ctx.getRepository('ProfessionalAccount');

	// Get the professional account
	const professionalAccount = await professionalAccountRepository.findOne({
		where: { account: { id: accountId } }
	});

	if (!professionalAccount) {
		ctx.throw(403, 'Only professional accounts can access establishments');
		return;
	}

	// Get the establishment and verify ownership
	const establishment = await establishmentRepository.findOne({
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
	const transformedEstablishment = {
		...establishment,
		products: establishment.products?.map((product: Product) => ({
			...product,
			categories: product.categories?.map((pc: ProductCategory) => ({
				id: pc.category.id,
				name: pc.category.name
			}))
		}))
	};

	ctx.status = 200;
	ctx.body = transformedEstablishment;
};

/**
 * Create a new establishment
 */
export const createOne = async (ctx: TypeORMContext) => {
	const accountId = ctx.state.account.id;
	const { name, address, description, avatar, banner } = ctx.request.body;
	const establishmentRepository = ctx.getRepository('Establishment');
	const professionalAccountRepository = ctx.getRepository('ProfessionalAccount');

	// Get the professional account
	const professionalAccount = await professionalAccountRepository.findOne({
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

	await establishmentRepository.save(establishment);

	ctx.status = 201;
	ctx.body = establishment;
};

/**
 * Update an establishment
 */
export const updateOne = async (ctx: TypeORMContext) => {
	const { establishmentId } = ctx.params;
	const accountId = ctx.state.account.id;
	const { name, address, description, status, avatar, banner } = ctx.request.body;
	const establishmentRepository = ctx.getRepository('Establishment');
	const professionalAccountRepository = ctx.getRepository('ProfessionalAccount');

	// Get the professional account
	const professionalAccount = await professionalAccountRepository.findOne({
		where: { account: { id: accountId } }
	});

	if (!professionalAccount) {
		ctx.throw(403, 'Only professional accounts can update establishments');
		return;
	}

	// Get the establishment and verify ownership
	const establishment = await establishmentRepository.findOne({
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
	if (name) establishment.name = name;
	if (address) establishment.address = address;
	if (description !== undefined) establishment.description = description;
	if (status) establishment.status = status;
	if (avatar !== undefined) establishment.avatar = avatar;
	if (banner !== undefined) establishment.banner = banner;

	const updatedEstablishment = await establishmentRepository.save(establishment);

	ctx.status = 200;
	ctx.body = updatedEstablishment;
};

/**
 * Delete an establishment
 */
export const deleteOne = async (ctx: TypeORMContext) => {
	const { establishmentId } = ctx.params;
	const accountId = ctx.state.account.id;
	const establishmentRepository = ctx.getRepository('Establishment');
	const professionalAccountRepository = ctx.getRepository('ProfessionalAccount');

	// Get the professional account
	const professionalAccount = await professionalAccountRepository.findOne({
		where: { account: { id: accountId } }
	});

	if (!professionalAccount) {
		ctx.throw(403, 'Only professional accounts can delete establishments');
		return;
	}

	// Get the establishment and verify ownership
	const establishment = await establishmentRepository.findOne({
		where: {
			id: establishmentId,
			professionalAccount: { id: professionalAccount.id }
		}
	});

	if (!establishment) {
		ctx.throw(404, 'Establishment not found or you do not have permission to delete it');
		return;
	}

	await establishmentRepository.remove(establishment);

	ctx.status = 204;
}; 