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

interface TransformedAccount {
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
					console.log('Login response:', data);
					
					// First set the session token
					dispatch(
						setCredentials({
							account: {
								id: data.account.id,
								email: data.account.email,
								accountType: 'PERSONAL', // Default to PERSONAL until we fetch full details
								status: {
									isVerified: true,
									isActive: true
								}
							},
							sessionToken: data.sessionToken
						})
					);

					// Then fetch complete account info
					const [getCurrentUser] = authApi.endpoints.getCurrentUser.useLazyQuery();
					const accountResponse = await getCurrentUser();
					
					if (accountResponse.data) {
						const fullAccount = accountResponse.data.account;
						console.log('Full account info:', fullAccount);
						dispatch(
							setCredentials({
								account: {
									id: fullAccount.id,
									email: fullAccount.email,
									forename: fullAccount.forename,
									surname: fullAccount.surname,
									accountType: fullAccount.accountType,
									status: {
										isVerified: fullAccount.status.isVerified,
										isActive: fullAccount.status.isActive
									}
								},
								sessionToken: data.sessionToken
							})
						);
					}
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
					console.log('Complete signup response:', data);
					
					if (!data || !data.account) {
						throw new Error('Invalid response from server');
					}

					// Transform the account data to match our expected format
					const transformedAccount: TransformedAccount = {
						id: data.account.id,
						email: data.account.email,
						forename: data.account.forename,
						surname: data.account.surname,
						accountType: data.account.accountType,
						status: {
							isVerified: true, // Since they just completed signup
							isActive: true   // New accounts are active by default
						}
					};

					dispatch(
						setCredentials({
							account: transformedAccount,
							sessionToken: data.sessionToken
						})
					);
				} catch (error) {
					console.error('Complete signup failed:', error);
					// You might want to dispatch an error action here
				}
			}
		}),

		// Get current user endpoint
		getCurrentUser: builder.query<{ account: TransformedAccount }, void>({
			query: () => '/authentication/me',
			providesTags: ['Account' as TagDescription<'Account'>],
			transformResponse: (response: any) => {
				console.log('Raw getCurrentUser response:', response);
				if (!response || !response.account) {
					console.error('Invalid response from getCurrentUser:', response);
					return {
						account: {
							id: '',
							email: '',
							accountType: 'PERSONAL',
							status: {
								isVerified: false,
								isActive: false
							}
						}
					};
				}

				const account = response.account;
				console.log('Account data from getCurrentUser:', {
					id: account.id,
					email: account.email,
					forename: account.forename,
					surname: account.surname,
					accountType: account.accountType,
					status: account.status
				});

				return {
					account: {
						id: account.id,
						email: account.email,
						forename: account.forename || undefined,
						surname: account.surname || undefined,
						accountType: account.accountType || 'PERSONAL',
						status: {
							isVerified: account.status?.status === 'ACTIVE' || false,
							isActive: account.status?.status === 'ACTIVE' || false
						}
					}
				};
			}
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
