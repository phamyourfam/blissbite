/**
 * OrderStatus Entity
 *
 * Tracks status changes for orders
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
export class OrderStatus {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@ManyToOne(() => Order, (order) => order.statuses)
	@JoinColumn({ name: 'order_id' })
	order: Relation<Order>;

	@Column()
	status_id: string;

	@Column({ type: 'text', nullable: true })
	notes?: string;

	@CreateDateColumn()
	created_at: Date;

	@Column({ nullable: true })
	created_by?: string; // Account ID
}
