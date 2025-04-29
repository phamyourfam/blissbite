/**
 * OrderStatusLookup Entity
 *
 * Lookup table for order statuses.
 */

import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class OrderStatusLookup {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;
}
