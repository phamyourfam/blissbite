/**
 * Account Entity
 *
 * Represents a user account. This entity stores basic account
 * information and defines relationships to personal/professional
 * details, sessions, verifications, orders, reviews, and favorites.
 */

import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
	OneToOne,
	OneToMany,
	JoinColumn,
	Relation
} from 'typeorm';

import { Session } from '../authentication/authentication.session.entity';
import { Favorite } from '../favorite/favorite.entity';
import { Order } from '../order/order.entity';
import { Review } from '../review/review.entity';
import { AccountStatus } from './account.status.entity';
import { ProfessionalAccount } from './account.professional.entity';
import { PersonalAccount } from './account.personal.entity';
import { AccountVerification } from './account.verification.entity';

@Entity()
export class Account {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ unique: true })
	email: string;

	@Column()
	password_hash: string;

	@Column()
	forename: string;

	@Column()
	surname: string;

	@Column({ nullable: true })
	phone_number?: string;

	@CreateDateColumn()
	created_at: Date;

	@UpdateDateColumn()
	updated_at: Date;

	@Column()
	accountType: 'PERSONAL' | 'PROFESSIONAL';

	@OneToOne(() => AccountStatus, (status) => status.account, { eager: true })
	@JoinColumn()
	status: Relation<AccountStatus>;

	@OneToOne(() => PersonalAccount, 'account')
	personalAccount: Relation<PersonalAccount>;

	@OneToOne(() => ProfessionalAccount, (professional) => professional.account)
	professionalAccount: Relation<ProfessionalAccount>;

	@OneToMany(() => Session, (session) => session.account)
	sessions: Relation<Session>[];

	@OneToMany(() => AccountVerification, (verification) => verification.account)
	verifications: Relation<AccountVerification>[];

	@OneToMany(() => Order, (order) => order.account)
	orders: Relation<Order>[];

	@OneToMany(() => Review, (review) => review.account)
	reviews: Relation<Review>[];

	@OneToMany(() => Favorite, (favorite) => favorite.account)
	favorites: Relation<Favorite>[];
}
