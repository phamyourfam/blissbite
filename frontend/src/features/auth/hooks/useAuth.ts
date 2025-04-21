import { useAppSelector } from '../../../app/hooks';
import { selectCurrentUser } from '../authSlice';

interface AuthDetails {
    isAuthenticated: boolean;
    account: {
        id: string;
        email: string;
        forename?: string;
        surname?: string;
        accountType: 'PERSONAL' | 'PROFESSIONAL';
    } | null;
    isLoading: boolean;
}

/**
 * useAuth Hook
 * 
 * Provides authentication state and account details throughout the application.
 * Returns an object containing:
 * - isAuthenticated: boolean indicating if account is logged in
 * - account: object containing account details or null if not authenticated
 * - isLoading: boolean indicating if auth state is being determined
 * 
 * @example
 * const { isAuthenticated, account } = useAuth();
 * if (isAuthenticated) {
 *   console.log(`Welcome ${account.forename}!`);
 * }
 */
export const useAuth = (): AuthDetails => {
    const account = useAppSelector(selectCurrentUser);

    return {
        isAuthenticated: !!account,
        account: account ? {
            id: account.id,
            email: account.email,
            forename: account.forename,
            surname: account.surname,
            accountType: account.accountType
        } : null,
        isLoading: false // TODO: Add loading state from auth slice if needed
    };
}; 