import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../../app/store';
import { setCredentials } from '../../features/auth/authSlice';

interface UpdateAccountRequest {
	accountId: string;
	forename?: string;
	surname?: string;
	accountType?: 'PERSONAL' | 'PROFESSIONAL';
}

export const accountApi = createApi({
	reducerPath: 'accountApi',
	baseQuery: fetchBaseQuery({
		baseUrl: `${process.env.REACT_APP_API_BASE_URL}/${process.env.REACT_APP_API_VERSION}/accounts`,
		credentials: 'include', // This ensures cookies are sent with requests
		prepareHeaders: (headers) => {
			// No need to set Authorization header as we're using session cookies
			return headers;
		},
	}),
	tagTypes: ['Account'],
	endpoints: (builder) => ({
		getAccount: builder.query({
			query: (accountId) => `/${accountId}`,
			providesTags: ['Account'],
		}),
		updateAccount: builder.mutation({
			query: ({ accountId, ...body }) => ({
				url: `/${accountId}`,
				method: 'PATCH',
				body,
			}),
			invalidatesTags: ['Account'],
			async onQueryStarted({ accountId, accountType }, { dispatch, queryFulfilled, getState }) {
				try {
					const { data } = await queryFulfilled;
					// If account type was updated, update the auth state
					if (accountType) {
						const state = getState() as RootState;
						const currentAccount = state.auth.account;
						if (currentAccount) {
							dispatch(setCredentials({
								account: {
									...currentAccount,
									accountType: accountType
								},
								sessionToken: state.auth.sessionToken || ''
							}));
						}
					}
				} catch (error) {
					console.error('Failed to update account:', error);
				}
			},
		}),
	}),
});

export const { useGetAccountQuery, useUpdateAccountMutation } = accountApi; 