/**
 * AccountStatus Entity
 *
 * Tracks account status for administrative purposes.
 * One-to-one relationship with Account.
 */

import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	OneToOne,
	PrimaryGeneratedColumn,
	Relation
} from 'typeorm';

import { Account } from './account.entity';

@Entity()
export class AccountStatus {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column()
	status: 'PENDING' | 'ACTIVE' | 'SUSPENDED' | 'SOFT_DELETED';

	@Column({ nullable: true })
	reason: string;

	@CreateDateColumn()
	recordedAt: Date;

	@OneToOne(() => Account, { onDelete: 'CASCADE' })
	account: Relation<Account>;
}
