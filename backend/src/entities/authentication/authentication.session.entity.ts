/**
 * Session Entity
 *
 * Represents a login session for an account.
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

import { Account } from '../account/account.entity';

@Entity()
export class Session {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@ManyToOne(() => Account, 'sessions')
	@JoinColumn({ name: 'account_id' })
	account: Relation<Account>;

	@Column({ unique: true })
	session_token: string;

	@Column({ nullable: true })
	ip_address: string;

	@Column({ nullable: true })
	user_agent: string;

	@CreateDateColumn()
	created_at: Date;

	@Column()
	expires_at: Date;

	@Column()
	last_activity: Date;
}
