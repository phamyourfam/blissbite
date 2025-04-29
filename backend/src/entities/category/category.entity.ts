/**
 * Category Entity
 *
 * Represents a product category within an establishment's menu.
 */

import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	ManyToOne,
	JoinColumn,
	OneToMany,
	Relation
} from 'typeorm';

import { Establishment } from '../establishment/establishment.entity';
import { ProductCategory } from '../product/product.category.entity';

@Entity()
export class Category {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@ManyToOne(() => Establishment, (est) => est.categories)
	@JoinColumn({ name: 'establishment_id' })
	establishment: Relation<Establishment>;

	@Column()
	name: string;

	@Column({ type: 'text', nullable: true })
	description?: string;

	@Column({ type: 'int' })
	display_order: number;

	@OneToMany(() => ProductCategory, (pc) => pc.category)
	productCategories: Relation<ProductCategory[]>;
}
