export interface Account {
	id: string;
	email: string;
	forename: string;
	surname: string;
	accountType: 'PERSONAL' | 'PROFESSIONAL';
	status: {
		status: 'ACTIVE' | 'SUSPENDED' | 'SOFT_DELETED';
	};
	verifications: {
		method: string;
		verified_at: Date;
	}[];
} 