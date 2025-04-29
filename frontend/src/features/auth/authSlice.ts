import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';

// Define the account type based on the backend entity
interface Account {
	id: string;
	email: string;
	forename?: string;
	surname?: string;
	accountType: 'PERSONAL' | 'PROFESSIONAL';
	status: {
		isVerified: boolean;
		isActive: boolean;
	};
}

// Define the signup form values interface
interface SignupFormValues {
	email: string;
	password: string;
	confirmPassword?: string;
	forename?: string;
	surname?: string;
	verificationCode?: string;
	tempAccountId?: string;
	accountId?: string;
}

// Define a type for the slice state
interface AuthState {
	account: Account | null;
	isAuthenticated: boolean;
	isLoading: boolean;
	error: string | null;
	// Signup flow state
	authMode: 'login' | 'signup' | 'verify';
	sessionToken: string | null;
	isTemporaryAccount: boolean;
	signupFormData: {
		email: string;
		password: string;
		forename?: string;
		surname?: string;
		accountType?: 'PERSONAL' | 'PROFESSIONAL';
	} | null;
}

// Helper function to load persisted state
const loadPersistedState = (): Partial<AuthState> => {
	try {
		const persistedState = localStorage.getItem('authState');
		if (persistedState) {
			const state = JSON.parse(persistedState);
			console.log('Loaded persisted auth state:', state);
			return state;
		}
	} catch (error) {
		console.error('Error loading persisted auth state:', error);
	}
	return {};
};

// Define the initial state using that type
const initialState: AuthState = {
	account: null,
	isAuthenticated: false,
	isLoading: true,
	error: null,
	// Signup flow initial state
	authMode: 'login',
	sessionToken: null,
	isTemporaryAccount: false,
	signupFormData: null,
	...loadPersistedState()
};

console.log('Initial auth state:', initialState);

const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		setCredentials: (state, action: PayloadAction<{ account: Account; sessionToken: string }>) => {
			console.log('Setting credentials:', action.payload);
			state.account = action.payload.account;
			state.sessionToken = action.payload.sessionToken;
			state.isAuthenticated = true;
			state.isLoading = false;
			state.error = null;
			localStorage.setItem('authState', JSON.stringify({
				account: action.payload.account,
				sessionToken: action.payload.sessionToken,
				isAuthenticated: true
			}));
		},
		logout: (state) => {
			state.account = null;
			state.sessionToken = null;
			state.isAuthenticated = false;
			state.isLoading = false;
			state.error = null;
			localStorage.removeItem('authState');
		},
		setLoading: (state, action: PayloadAction<boolean>) => {
			state.isLoading = action.payload;
		},
		setError: (state, action: PayloadAction<string | null>) => {
			state.error = action.payload;
		},
		updateAccountType: (state, action: PayloadAction<'PERSONAL' | 'PROFESSIONAL'>) => {
			if (state.account) {
				state.account.accountType = action.payload;
				state.error = null;
			}
		},
		// Signup flow reducers
		setAuthMode: (state, action: PayloadAction<'login' | 'signup' | 'verify'>) => {
			state.authMode = action.payload;
		},
		setSessionToken: (state, action: PayloadAction<string | null>) => {
			state.sessionToken = action.payload;
		},
		setIsTemporaryAccount: (state, action: PayloadAction<boolean>) => {
			state.isTemporaryAccount = action.payload;
		},
		setSignupFormData: (state, action: PayloadAction<AuthState['signupFormData']>) => {
			state.signupFormData = action.payload;
		},
		saveSignupSession: (state, action: PayloadAction<{
			isTemporary: boolean;
			formData: AuthState['signupFormData'];
		}>) => {
			state.isTemporaryAccount = action.payload.isTemporary;
			state.signupFormData = action.payload.formData;
		},
		clearSignupState: (state) => {
			state.authMode = 'login';
			state.sessionToken = null;
			state.isTemporaryAccount = false;
			state.signupFormData = null;
		}
	}
});

// Export actions for use in components or other logic
export const {
	setCredentials,
	logout,
	setLoading,
	setError,
	updateAccountType,
	setAuthMode,
	setSessionToken,
	setIsTemporaryAccount,
	setSignupFormData,
	saveSignupSession,
	clearSignupState
} = authSlice.actions;

// Selectors
export const selectCurrentUser = (state: RootState) => state.auth.account;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectAuthLoading = (state: RootState) => state.auth.isLoading;
export const selectAuthError = (state: RootState) => state.auth.error;
export const selectAuthMode = (state: RootState) => state.auth.authMode;
export const selectSessionToken = (state: RootState) => state.auth.sessionToken;
export const selectIsTemporaryAccount = (state: RootState) => state.auth.isTemporaryAccount;
export const selectSignupFormData = (state: RootState) => state.auth.signupFormData;

// Export the reducer as default
export default authSlice.reducer;
