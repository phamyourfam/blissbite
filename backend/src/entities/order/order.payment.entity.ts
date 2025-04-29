/**
 * Payment Entity
 *
 * Tracks payments for orders
 */

import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	ManyToOne,
	JoinColumn,
	CreateDateColumn,
	Relation
} from 'typeorm';
import { Order } from './order.entity';

@Entity()
export class OrderPayment {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@ManyToOne(() => Order, (order) => order.payments)
	@JoinColumn({ name: 'order_id' })
	order: Relation<Order>;

	@Column({ type: 'decimal' })
	amount: number;

	@Column()
	payment_method_id: string;

	@Column()
	payment_status_id: string;

	@Column({ nullable: true })
	transaction_id?: string;

	@CreateDateColumn()
	created_at: Date;
}
