/**
 * EstablishmentHours Entity
 *
 * Represents the operating hours for an establishment.
 */

import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	ManyToOne,
	JoinColumn,
	Relation // <-- added import
} from 'typeorm';

import { Establishment } from '.';

@Entity()
export class EstablishmentHours {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@ManyToOne(() => Establishment, (est) => est.hours)
	@JoinColumn({ name: 'establishment_id' })
	establishment: Relation<Establishment>; // <-- updated relation type

	@Column({ type: 'int' })
	day_of_week: number; // 0 (Sunday) to 6 (Saturday)

	@Column({ type: 'time' })
	opening_time: string;

	@Column({ type: 'time' })
	closing_time: string;

	@Column({ default: false })
	is_closed: boolean;
}
