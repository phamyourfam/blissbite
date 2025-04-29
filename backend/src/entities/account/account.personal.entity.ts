/**
 * PersonalAccount Entity
 *
 * Represents a personal account with consumer-specific properties.
 * Has a one-to-one relationship with the base Account entity.
 */

import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
	OneToOne,
	JoinColumn,
	Relation
} from 'typeorm';

import { Account } from './account.entity';

@Entity()
export class PersonalAccount {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@OneToOne(() => Account, 'personalAccount')
	@JoinColumn({ name: 'account_id' })
	account: Relation<Account>;

	@Column({ nullable: true })
	date_of_birth?: Date;

	@Column({ nullable: true })
	preferences?: string;

	@CreateDateColumn()
	created_at: Date;

	@UpdateDateColumn()
	updated_at: Date;

	// Additional personal account specific fields can be added here
}
