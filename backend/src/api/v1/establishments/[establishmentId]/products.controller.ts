import { TypeORMContext } from '../../../../middleware';

interface ProductFormValues {
  name: string;
  description?: string;
  base_price: number;
  is_available: boolean;
  image_urls?: string[];
  preparation_time?: number;
}

/**
 * Create a new product for an establishment
 */
export const createOne = async (ctx: TypeORMContext) => {
  const { establishmentId } = ctx.params;
  const accountId = ctx.state.account.id;
  const productData: ProductFormValues = ctx.request.body;
  const productRepository = ctx.getRepository('Product');
  const establishmentRepository = ctx.getRepository('Establishment');
  const professionalAccountRepository = ctx.getRepository('ProfessionalAccount');

  // Get the professional account
  const professionalAccount = await professionalAccountRepository.findOne({
    where: { account: { id: accountId } }
  });

  if (!professionalAccount) {
    ctx.throw(403, 'Only professional accounts can create products');
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
    ctx.throw(404, 'Establishment not found or you do not have permission to add products to it');
    return;
  }

  // Create the product
  const product = productRepository.create({
    ...productData,
    establishment
  });

  await productRepository.save(product);

  ctx.status = 201;
  ctx.body = product;
};

/**
 * Get all products for an establishment
 */
export const getAll = async (ctx: TypeORMContext) => {
  const { establishmentId } = ctx.params;
  const accountId = ctx.state.account.id;
  const productRepository = ctx.getRepository('Product');
  const establishmentRepository = ctx.getRepository('Establishment');
  const professionalAccountRepository = ctx.getRepository('ProfessionalAccount');

  // Get the professional account
  const professionalAccount = await professionalAccountRepository.findOne({
    where: { account: { id: accountId } }
  });

  if (!professionalAccount) {
    ctx.throw(403, 'Only professional accounts can access products');
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
    ctx.throw(404, 'Establishment not found or you do not have permission to access its products');
    return;
  }

  // Parse filters from query
  const {
    minPrice,
    maxPrice,
    category,
    availableOnly,
    sortBy = 'price',
    order = 'asc',
    search
  } = ctx.query;

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
  if (!orderStr) orderStr = 'asc';
  orderStr = typeof orderStr === 'string' ? orderStr.toUpperCase() : 'ASC';

  // Sorting
  if (sortByStr === 'rating') {
    // Sort by average rating (need subquery)
    qb = qb
      .leftJoin(
        (subqb: any) =>
          subqb
            .select('review.reviewable_id', 'productId')
            .addSelect('AVG(review.rating)', 'avgRating')
            .from('review', 'review')
            .where("review.reviewable_type_id = (SELECT id FROM reviewable_type_lookup WHERE name = 'Product')")
            .groupBy('review.reviewable_id'),
        'reviewAvg',
        'reviewAvg.productId = product.id'
      )
      .addSelect('COALESCE(reviewAvg.avgRating, 0)', 'avgRating')
      .orderBy('avgRating', orderStr === 'DESC' ? 'DESC' : 'ASC');
  } else if (sortByStr === 'popularity') {
    // Sort by order count (need subquery)
    qb = qb
      .leftJoin(
        (subqb: any) =>
          subqb
            .select('orderProduct.product_id', 'productId')
            .addSelect('COUNT(orderProduct.id)', 'orderCount')
            .from('order_product', 'orderProduct')
            .groupBy('orderProduct.product_id'),
        'popularity',
        'popularity.productId = product.id'
      )
      .addSelect('COALESCE(popularity.orderCount, 0)', 'orderCount')
      .orderBy('orderCount', orderStr === 'DESC' ? 'DESC' : 'ASC');
  } else {
    // Default: sort by price or any other product field
    qb = qb.orderBy(`product.base_price`, orderStr === 'DESC' ? 'DESC' : 'ASC');
  }

  // Execute query
  const products = await qb.getMany();

  ctx.status = 200;
  ctx.body = products;
};

/**
 * Update a product
 */
export const updateOne = async (ctx: TypeORMContext) => {
  const { establishmentId, productId } = ctx.params;
  const accountId = ctx.state.account.id;
  const productData: Partial<ProductFormValues> = ctx.request.body;
  const productRepository = ctx.getRepository('Product');
  const establishmentRepository = ctx.getRepository('Establishment');
  const professionalAccountRepository = ctx.getRepository('ProfessionalAccount');

  // Get the professional account
  const professionalAccount = await professionalAccountRepository.findOne({
    where: { account: { id: accountId } }
  });

  if (!professionalAccount) {
    ctx.throw(403, 'Only professional accounts can update products');
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
    ctx.throw(404, 'Establishment not found or you do not have permission to update its products');
    return;
  }

  // Get the product and verify it belongs to the establishment
  const product = await productRepository.findOne({
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
  const updatedProduct = await productRepository.save(product);

  ctx.status = 200;
  ctx.body = updatedProduct;
};

/**
 * Delete a product
 */
export const deleteOne = async (ctx: TypeORMContext) => {
  const { establishmentId, productId } = ctx.params;
  const accountId = ctx.state.account.id;
  const productRepository = ctx.getRepository('Product');
  const establishmentRepository = ctx.getRepository('Establishment');
  const professionalAccountRepository = ctx.getRepository('ProfessionalAccount');

  // Get the professional account
  const professionalAccount = await professionalAccountRepository.findOne({
    where: { account: { id: accountId } }
  });

  if (!professionalAccount) {
    ctx.throw(403, 'Only professional accounts can delete products');
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
    ctx.throw(404, 'Establishment not found or you do not have permission to delete its products');
    return;
  }

  // Get the product and verify it belongs to the establishment
  const product = await productRepository.findOne({
    where: {
      id: productId,
      establishment: { id: establishmentId }
    }
  });

  if (!product) {
    ctx.throw(404, 'Product not found or you do not have permission to delete it');
    return;
  }

  await productRepository.remove(product);

  ctx.status = 204;
}; 