/**
 * ProductOption Entity
 *
 * Represents a customizable option for a product.
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

import { Product } from './product.entity';
import { ProductOptionChoice } from './product.optionChoice.entity';

@Entity()
export class ProductOption {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@ManyToOne(() => Product, (product) => product.options)
	@JoinColumn({ name: 'product_id' })
	product: Relation<Product>;

	@Column()
	name: string;

	@Column({ type: 'text', nullable: true })
	description?: string;

	@Column({ type: 'int' })
	min_selections: number;

	@Column({ type: 'int' })
	max_selections: number;

	@OneToMany(() => ProductOptionChoice, (choice) => choice.productOption)
	choices: Relation<ProductOptionChoice[]>;
}
