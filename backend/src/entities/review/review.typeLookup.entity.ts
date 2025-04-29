/**
 * ReviewableTypeLookup Entity
 *
 * Defines the types of entities that can be reviewed (e.g., product, establishment)
 */

import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class ReviewableTypeLookup {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    name: string;

    @Column({ nullable: true })
    description?: string;
}
