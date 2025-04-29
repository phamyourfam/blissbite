import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import baseApi from '../services/baseApi';
import { accountApi } from '../features/account/accountApi';
import { establishmentsApi } from '../features/establishments/establishmentsApi';
import { accountTypeMiddleware } from '../features/auth/accountTypeMiddleware';

export const store = configureStore({
	reducer: {
		auth: authReducer,
		[baseApi.reducerPath]: baseApi.reducer,
		[accountApi.reducerPath]: accountApi.reducer,
		[establishmentsApi.reducerPath]: establishmentsApi.reducer
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware()
			.concat(baseApi.middleware)
			.concat(accountApi.middleware)
			.concat(establishmentsApi.middleware)
			.concat(accountTypeMiddleware)
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
