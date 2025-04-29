/**
 * BusinessRoleLookup Entity
 *
 * Defines roles for professional accounts (e.g., owner, manager, staff)
 */

import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class EstablishmentRoleLookup {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ unique: true })
	name: string;

	@Column({ nullable: true })
	description?: string;
}
