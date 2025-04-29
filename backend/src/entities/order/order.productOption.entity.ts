/**
 * OrderProductOption Entity
 *
 * Represents an option selected for an ordered product.
 */

import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	ManyToOne,
	Relation
} from 'typeorm';
import { OrderProduct } from './order.product.entity';
import { ProductOptionChoice } from '../product/product.optionChoice.entity';

@Entity()
export class OrderProductOption {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@ManyToOne(() => OrderProduct, (product) => product.options)
	orderProduct: Relation<OrderProduct>;

	@ManyToOne(() => ProductOptionChoice)
	productOptionChoice: Relation<ProductOptionChoice>;

	@Column({ type: 'decimal', precision: 10, scale: 2 })
	additionalCost: number;

	@Column({ type: 'text', nullable: true })
	notes?: string;
}
