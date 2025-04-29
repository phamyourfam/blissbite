/**
 * Review Entity
 *
 * Represents a review written by an account for a reviewable entity.
 * Uses a polymorphic approach via reviewable_id and reviewable_type lookup.
 */

import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	ManyToOne,
	JoinColumn,
	CreateDateColumn,
	UpdateDateColumn,
	Relation
} from 'typeorm';
import { Account } from '../account/account.entity';
import { ReviewableTypeLookup } from './review.typeLookup.entity';

@Entity()
export class Review {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@ManyToOne(() => Account, (account) => account.reviews)
	@JoinColumn({ name: 'account_id' })
	account: Relation<Account>;

	@Column({ type: 'uuid' })
	reviewable_id: string;

	@ManyToOne(() => ReviewableTypeLookup)
	@JoinColumn({ name: 'reviewable_type_id' })
	reviewableType: Relation<ReviewableTypeLookup>;

	@Column({ type: 'int' })
	rating: number;

	@Column({ nullable: true })
	title?: string;

	@Column({ type: 'text', nullable: true })
	comment?: string;

	@Column({ default: false })
	is_anonymous: boolean;

	@CreateDateColumn()
	created_at: Date;

	@UpdateDateColumn({ nullable: true })
	updated_at?: Date;
}
