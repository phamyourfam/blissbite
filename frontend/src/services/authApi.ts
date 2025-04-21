import baseApi from './baseApi';
import { setCredentials, logout } from '../features/auth/authSlice';
import { TagDescription } from '@reduxjs/toolkit/query/react';

// Define request/response types
interface AuthResponse {
	account: {
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
	};
	sessionToken: string;
}

interface LoginRequest {
	email: string;
	password: string;
}

interface SignupStartRequest {
	email: string;
	password: string;
	forename: string;
	surname: string;
}

interface SignupStartResponse {
	tempAccountId: string;
	accountId: string;
}

interface VerifyEmailCodeRequest {
	tempAccountId: string;
	accountId: string;
	code: string;
}

interface VerifyCodeRequest {
	tempAccountId: string;
	accountId: string;
	code: string;
}

interface VerifyCodeResponse {
	success: boolean;
	message: string;
	token: string;
}

interface CompleteSignupRequest {
	tempAccountId: string;
	verificationToken: string;
	accountId: string;
}

// Inject auth endpoints into the base API
export const authApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		// Login endpoint
		login: builder.mutation<AuthResponse, LoginRequest>({
			query: (credentials: LoginRequest) => ({
				url: '/authentication/login',
				method: 'POST',
				body: credentials
			}),
			async onQueryStarted(_arg: LoginRequest, { dispatch, queryFulfilled }) {
				try {
					const { data } = await queryFulfilled;
					dispatch(
						setCredentials({
							account: data.account,
							sessionToken: data.sessionToken
						})
					);
				} catch (error) {
					console.error('Login failed:', error);
				}
			}
		}),

		// Signup start endpoint - creates a temporary account
		signupStart: builder.mutation<SignupStartResponse, SignupStartRequest>({
			query: (userData: SignupStartRequest) => ({
				url: '/authentication/signup/start',
				method: 'POST',
				body: userData
			})
			// No onQueryStarted because this is just the first step
		}),

		// Resend verification code
		resendVerificationCode: builder.mutation<
			SignupStartResponse,
			{ email: string; tempAccountId: string }
		>({
			query: (data: { email: string; tempAccountId: string }) => ({
				url: '/authentication/signup/start',
				method: 'POST',
				body: {
					...data,
					resendCode: true
				}
			})
		}),

		// Verify email code endpoint
		verifyEmailCode: builder.mutation<VerifyCodeResponse, VerifyCodeRequest>({
			query: (verificationData: VerifyCodeRequest) => ({
				url: `/authentication/verify-email/${verificationData.code}`,
				method: 'POST',
				body: {
					tempAccountId: verificationData.tempAccountId,
					accountId: verificationData.accountId
				}
			})
		}),

		// Complete signup - convert temporary account to permanent
		completeSignup: builder.mutation<AuthResponse, CompleteSignupRequest>({
			query: (data: CompleteSignupRequest) => ({
				url: '/authentication/signup/complete',
				method: 'POST',
				body: {
					tempAccountId: data.tempAccountId,
					verificationToken: data.verificationToken,
					accountId: data.accountId
				}
			}),
			async onQueryStarted(_arg: CompleteSignupRequest, { dispatch, queryFulfilled }) {
				try {
					const { data } = await queryFulfilled;
					dispatch(
						setCredentials({
							account: data.account,
							sessionToken: data.sessionToken
						})
					);
				} catch (error) {
					console.error('Complete signup failed:', error);
				}
			}
		}),

		// Get current user endpoint
		getCurrentUser: builder.query<{ account: AuthResponse['account'] }, void>({
			query: () => '/authentication/me',
			providesTags: ['Account' as TagDescription<'Account'>],
			transformResponse: (response: { account: any }) => ({
				account: {
					id: response.account.id,
					email: response.account.email,
					forename: response.account.forename,
					surname: response.account.surname,
					accountType: response.account.accountType,
					status: response.account.status,
					verifications: response.account.verifications
				}
			})
		}),

		// Logout endpoint
		logout: builder.mutation<void, void>({
			query: () => ({
				url: '/authentication/logout',
				method: 'POST'
			}),
			invalidatesTags: ['Account' as TagDescription<'Account'>, 'Auth' as TagDescription<'Auth'>],
			async onQueryStarted(_arg: void, { dispatch, queryFulfilled }) {
				try {
					await queryFulfilled;
					dispatch(logout());
				} catch (error) {
					console.error('Logout failed:', error);
					// Even if API fails, force logout on client
					dispatch(logout());
				}
			}
		}),

		// Delete account endpoint (for cancelling signup)
		deleteAccount: builder.mutation<void, { accountId: string }>({
			query: ({ accountId }: { accountId: string }) => ({
				url: `/accounts/${accountId}`,
				method: 'DELETE'
			})
		})
	})
});

// Export hooks for usage in components
export const {
	useLoginMutation,
	useSignupStartMutation,
	useResendVerificationCodeMutation,
	useVerifyEmailCodeMutation,
	useCompleteSignupMutation,
	useGetCurrentUserQuery,
	useLazyGetCurrentUserQuery,
	useLogoutMutation,
	useDeleteAccountMutation
} = authApi;
