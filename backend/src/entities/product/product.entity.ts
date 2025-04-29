/**
 * Product Entity
 *
 * Represents a product offered by an establishment.
 */

import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	ManyToOne,
	JoinColumn,
	CreateDateColumn,
	UpdateDateColumn,
	OneToMany,
	Relation
} from 'typeorm';

import { Establishment } from '../establishment/establishment.entity';
import { Favorite } from '../favorite/favorite.entity';
import { OrderProduct } from '../order/order.product.entity';
import { Review } from '../review/review.entity';
import { ProductCategory } from './product.category.entity';
import { ProductOption } from './product.option.entity';

@Entity()
export class Product {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@ManyToOne(() => Establishment, (est) => est.products)
	@JoinColumn({ name: 'establishment_id' })
	establishment: Relation<Establishment>;

	@Column()
	name: string;

	@Column({ type: 'text', nullable: true })
	description?: string;

	@Column({ type: 'decimal' })
	base_price: number;

	@Column({ default: true })
	is_available: boolean;

	@Column({ type: 'int', nullable: true })
	preparation_time?: number; // in minutes

	@Column('simple-array', { nullable: true })
	image_urls?: string[];

	@CreateDateColumn()
	created_at: Date;

	@UpdateDateColumn()
	updated_at: Date;

	@OneToMany(
		() => ProductCategory,
		(productCategory) => productCategory.product
	)
	categories: Relation<ProductCategory[]>;

	@OneToMany(() => ProductCategory, (pc) => pc.product)
	productCategories: Relation<ProductCategory[]>;

	@OneToMany(() => ProductOption, (option) => option.product)
	options: Relation<ProductOption[]>;

	@OneToMany(() => OrderProduct, (orderProduct) => orderProduct.product)
	orderProducts: Relation<OrderProduct[]>;

	// Reviews are linked via polymorphic relationship (reviewable_id)
	reviews: Relation<Review[]>;

	// Favorites are linked via polymorphic relationship (favorable_id)
	favorites: Relation<Favorite[]>;
}
