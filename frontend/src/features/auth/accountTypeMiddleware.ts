import { Middleware, UnknownAction } from '@reduxjs/toolkit';
import { updateAccountType, setError } from './authSlice';
import { store } from '../../app/store';
import { establishmentsApi } from '../establishments/establishmentsApi';
import { Establishment } from '../establishments/establishmentsApi';

export const accountTypeMiddleware: Middleware = (store) => (next) => async (action: UnknownAction) => {
  if (action.type === updateAccountType.type && action.payload === 'PERSONAL') {
    try {
      // Get the current establishments
      const result = await store.dispatch(
        establishmentsApi.endpoints.getEstablishments.initiate()
      );

      if ('data' in result && Array.isArray(result.data) && result.data.length > 0) {
        // If user has establishments, prevent the switch and show error
        store.dispatch(setError('Cannot switch to personal account while owning establishments'));
        return;
      }
    } catch (error) {
      console.error('Error checking establishments:', error);
    }
  }

  return next(action);
}; 