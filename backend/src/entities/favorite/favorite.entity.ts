/**
 * Favorite Entity
 *
 * Represents a favorite marking by an account for a favorable entity.
 * Uses a polymorphic approach via favorable_id and favorable_type lookup.
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
export class Favorite {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@ManyToOne(() => Account, 'favorites')
	@JoinColumn({ name: 'account_id' })
	account: Relation<Account>;

	@Column({ type: 'uuid' })
	favorable_id: string;

	@CreateDateColumn()
	created_at: Date;
}
