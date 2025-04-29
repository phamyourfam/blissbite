/**
 * Order Entity
 *
 * Represents an order placed by an account at an establishment.
 */

import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	ManyToOne,
	OneToMany,
	JoinColumn,
	CreateDateColumn,
	UpdateDateColumn,
	Relation
} from 'typeorm';

import { Account } from '../account/account.entity';
import { Establishment } from '../establishment/establishment.entity';
import { OrderPayment } from './order.payment.entity';
import { OrderProduct } from './order.product.entity';
import { OrderStatus } from './order.status.entity';

@Entity()
export class Order {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@ManyToOne(() => Account, (account) => account.orders, { nullable: true })
	@JoinColumn({ name: 'account_id' })
	account: Relation<Account>;

	@ManyToOne(() => Establishment, (est) => est.orders)
	@JoinColumn({ name: 'establishment_id' })
	establishment: Relation<Establishment>;

	@Column({ unique: true })
	order_number: string;

	@Column()
	status: string;

	@Column()
	type: string;

	@Column({ type: 'decimal' })
	subtotal: number;

	@Column({ type: 'decimal' })
	tax: number;

	@Column({ type: 'decimal' })
	total_price: number;

	@Column()
	customer_name: string;

	@Column()
	customer_phone: string;

	@Column({ nullable: true })
	customer_email?: string;

	@Column({ nullable: true })
	table_number?: string;

	@Column({ type: 'text', nullable: true })
	special_instructions?: string;

	@CreateDateColumn()
	created_at: Date;

	@UpdateDateColumn()
	updated_at: Date;

	@Column({ nullable: true })
	estimated_ready_time?: Date;

	@OneToMany(() => OrderProduct, (product) => product.order)
	products: Relation<OrderProduct[]>;

	@OneToMany(() => OrderPayment, (payment) => payment.order)
	payments: Relation<OrderPayment[]>;

	@OneToMany(() => OrderStatus, (orderStatus) => orderStatus.order)
	statuses: Relation<OrderStatus[]>;
}
