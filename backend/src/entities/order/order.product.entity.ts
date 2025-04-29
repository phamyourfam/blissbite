/**
 * OrderProduct Entity
 *
 * Represents an individual product within an order.
 */

import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	ManyToOne,
	OneToMany,
	Relation
} from 'typeorm';

import { Product } from '../product/product.entity';
import { Order } from './order.entity';
import { OrderProductOption } from './order.productOption.entity';

@Entity()
export class OrderProduct {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@ManyToOne(() => Order, (order) => order.products)
	order: Relation<Order>;

	@ManyToOne(() => Product, (product) => product.orderProducts)
	product: Relation<Product>;

	@Column()
	quantity: number;

	@OneToMany(() => OrderProductOption, (option) => option.orderProduct)
	options: Relation<OrderProductOption[]>;

	@Column({ type: 'decimal', precision: 10, scale: 2 })
	unitPrice: number;

	@Column({ type: 'decimal', precision: 10, scale: 2 })
	totalPrice: number;
}
