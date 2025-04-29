/**
 * EstablishmentProfessional Entity
 *
 * Represents the association between a professional account and an establishment,
 * including the role (lookup-based) and permissions.
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

import { ProfessionalAccount } from '../account/account.professional.entity';
import { Establishment } from './establishment.entity';

@Entity()
export class EstablishmentProfessional {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@ManyToOne(() => ProfessionalAccount)
	@JoinColumn({ name: 'professional_account_id' })
	professionalAccount: Relation<ProfessionalAccount>;

	@ManyToOne(() => Establishment, 'professionals')
	@JoinColumn({ name: 'establishment_id' })
	establishment: Relation<Establishment>;

	@Column()
	role: string;

	@CreateDateColumn()
	created_at: Date;
}
