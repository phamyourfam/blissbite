import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';

// Define the account type based on the backend entity
interface Account {
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
	sessionToken: string | null;
	isAuthenticated: boolean;
	isLoading: boolean;

	// Signup flow state
	signupStep: number;
	isTemporaryAccount: boolean;
	signupFormData: SignupFormValues | null;
	authMode: 'login' | 'signup';
}

// Helper function to load persisted state
const loadPersistedState = (): Partial<AuthState> => {
	try {
		const persistedState = localStorage.getItem('authState');
		if (persistedState) {
			return JSON.parse(persistedState);
		}
	} catch (error) {
		console.error('Error loading persisted auth state:', error);
	}
	return {};
};

// Define the initial state using that type
const initialState: AuthState = {
	account: null,
	sessionToken: null,
	isAuthenticated: false,
	isLoading: true,

	// Signup flow initial state
	signupStep: 0,
	isTemporaryAccount: false,
	signupFormData: null,
	authMode: 'login',
	...loadPersistedState()
};

export const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		// Action to set account and session token upon successful login/signup
		setCredentials: (
			state,
			action: PayloadAction<{ account: Account; sessionToken: string }>
		) => {
			state.account = action.payload.account;
			state.sessionToken = action.payload.sessionToken;
			state.isAuthenticated = true;
			state.isLoading = false;
			// Store auth state in localStorage for persistence
			localStorage.setItem('authState', JSON.stringify({
				account: action.payload.account,
				sessionToken: action.payload.sessionToken,
				isAuthenticated: true,
				isLoading: false
			}));
		},
		// Action to clear account and session on logout
		logout: (state) => {
			state.account = null;
			state.sessionToken = null;
			state.isAuthenticated = false;
			state.isLoading = false;
			// Remove auth state from storage
			localStorage.removeItem('authState');
		},
		// Action to set loading state
		setLoading: (state, action: PayloadAction<boolean>) => {
			state.isLoading = action.payload;
		},
		// Actions for signup flow
		setSignupStep: (state, action: PayloadAction<number>) => {
			state.signupStep = action.payload;
		},
		setIsTemporaryAccount: (state, action: PayloadAction<boolean>) => {
			state.isTemporaryAccount = action.payload;
		},
		setSignupFormData: (state, action: PayloadAction<SignupFormValues | null>) => {
			state.signupFormData = action.payload;
		},
		setAuthMode: (state, action: PayloadAction<'login' | 'signup'>) => {
			state.authMode = action.payload;
		},
		// Clear signup state
		clearSignupState: (state) => {
			state.signupStep = 0;
			state.isTemporaryAccount = false;
			state.signupFormData = null;
		},
		// Action to store entire signup session state
		saveSignupSession: (
			state,
			action: PayloadAction<{
				step: number;
				isTemporary: boolean;
				formData: SignupFormValues;
			}>
		) => {
			state.signupStep = action.payload.step;
			state.isTemporaryAccount = action.payload.isTemporary;
			state.signupFormData = action.payload.formData;
		}
	}
});

// Export actions for use in components or other logic
export const {
	setCredentials,
	logout,
	setLoading,
	setSignupStep,
	setIsTemporaryAccount,
	setSignupFormData,
	setAuthMode,
	clearSignupState,
	saveSignupSession
} = authSlice.actions;

// Selectors
export const selectCurrentUser = (state: RootState) => state.auth.account;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectIsLoading = (state: RootState) => state.auth.isLoading;
export const selectSignupStep = (state: RootState) => state.auth.signupStep;
export const selectIsTemporaryAccount = (state: RootState) => state.auth.isTemporaryAccount;
export const selectSignupFormData = (state: RootState) => state.auth.signupFormData;
export const selectAuthMode = (state: RootState) => state.auth.authMode;
export const selectSessionToken = (state: RootState) => state.auth.sessionToken;

// Export the reducer as default
export default authSlice.reducer;
