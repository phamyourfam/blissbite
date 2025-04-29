/**
 * ProductOptionChoice Entity
 *
 * Represents a selectable choice for a product option.
 */

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Relation } from 'typeorm';

import { ProductOption } from './product.option.entity';

@Entity()
export class ProductOptionChoice {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@ManyToOne(() => ProductOption, (option) => option.choices)
	productOption: Relation<ProductOption>;

	@Column()
	name: string;

	@Column({ type: 'decimal', precision: 10, scale: 2 })
	additionalCost: number;
}
