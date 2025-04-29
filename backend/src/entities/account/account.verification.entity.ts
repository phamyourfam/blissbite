/**
 * AccountVerification Entity
 *
 * Tracks verification status for different verification methods.
 */

import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	ManyToOne,
	JoinColumn,
	Relation,
	CreateDateColumn
} from 'typeorm';

import { Account } from './account.entity';

@Entity()
export class AccountVerification {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@ManyToOne(() => Account, (account) => account.verifications, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'account_id' })
	account: Relation<Account>;

	@Column()
	method: 'EMAIL' | 'SMS';

	@Column({ nullable: true })
	verified_at?: Date;

	@CreateDateColumn()
	created_at: Date;
}
