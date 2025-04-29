/**
 * ProfessionalAccount Entity
 *
 * Contains additional information for professional user accounts.
 */

import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
	OneToOne,
	JoinColumn,
	OneToMany,
	Relation
} from 'typeorm';

import { Account } from './account.entity';
import { Establishment } from '../establishment/establishment.entity';

@Entity()
export class ProfessionalAccount {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@OneToOne(() => Account, (account) => account.professionalAccount)
	@JoinColumn({ name: 'account_id' })
	account: Relation<Account>;

	@Column({ nullable: true })
	business_name?: string;

	@Column({ nullable: true })
	business_registration_number?: string;

	@Column({ nullable: true })
	tax_identification_number?: string;

	@OneToMany(() => Establishment, (establishment) => establishment.professionalAccount)
	establishments: Relation<Establishment>[];

	@CreateDateColumn()
	created_at: Date;

	@UpdateDateColumn()
	updated_at: Date;
}
