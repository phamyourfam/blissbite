/**
 * Establishment Entity
 *
 * Represents a business establishment.
 */

import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
	ManyToOne,
	OneToMany,
	JoinColumn,
	Relation
} from 'typeorm';

import { EstablishmentHours } from './establishment.hours.entity';
import { EstablishmentProfessional } from './establishment.professional.entity';
import { Category } from '../category/category.entity';
import { Product } from '../product/product.entity';
import { Order } from '../order/order.entity';
import { ProfessionalAccount } from '../account/account.professional.entity';

@Entity()
export class Establishment {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column()
	name: string;

	@Column()
	address: string;

	@Column({ type: 'text', nullable: true })
	description?: string;

	@Column({ default: 0 })
	productsCount: number;

	@Column({ default: 'active' })
	status: 'active' | 'inactive';

	@Column({ nullable: true })
	avatar?: string;

	@Column({ nullable: true })
	banner?: string;

	@ManyToOne(() => ProfessionalAccount, (professional) => professional.establishments)
	@JoinColumn({ name: 'professional_account_id' })
	professionalAccount: Relation<ProfessionalAccount>;

	@CreateDateColumn()
	created_at: Date;

	@UpdateDateColumn()
	updated_at: Date;

	@OneToMany(() => EstablishmentHours, (hours) => hours.establishment)
	hours: Relation<EstablishmentHours[]>;

	@OneToMany(
		() => EstablishmentProfessional,
		(establishmentProfessional) => establishmentProfessional.establishment
	)
	professionals: Relation<EstablishmentProfessional[]>;

	@OneToMany(() => Category, (category) => category.establishment)
	categories: Relation<Category[]>;

	@OneToMany(() => Product, (product) => product.establishment)
	products: Relation<Product[]>;

	@OneToMany(() => Order, (order) => order.establishment)
	orders: Relation<Order[]>;
}
