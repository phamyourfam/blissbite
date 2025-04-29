/**
 * ProductCategory Entity
 *
 * Links products to categories in an establishment's menu
 */

import {
	Entity,
	PrimaryGeneratedColumn,
	ManyToOne,
	JoinColumn,
	Relation
} from 'typeorm';
import { Product } from './product.entity';
import { Category } from '../category/category.entity';

@Entity()
export class ProductCategory {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@ManyToOne(() => Product, (product) => product.categories)
	@JoinColumn({ name: 'product_id' })
	product: Relation<Product>;

	@ManyToOne(() => Category, (category) => category.productCategories)
	@JoinColumn({ name: 'category_id' })
	category: Relation<Category>;
}
