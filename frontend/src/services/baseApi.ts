declare global {
  namespace NodeJS {
    interface ProcessEnv {
      REACT_APP_API_BASE_URL: string;
      REACT_APP_API_VERSION: string;
    }
  }
}

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../app/store';
import { handleGlobalError } from '../utils';

// Create a base API service that we'll inject endpoints into later
const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: async (args, api, extraOptions) => {
    // Use fetchBaseQuery as the underlying query function
    const baseQuery = fetchBaseQuery({
      baseUrl: `${process.env.REACT_APP_API_BASE_URL}/${process.env.REACT_APP_API_VERSION}`,
      credentials: 'include', // This ensures cookies are sent with requests
      prepareHeaders: (headers) => {
        // No need to set any headers as we're using session cookies
        return headers;
      },
    });

    try {
      // Execute the query
      const result = await baseQuery(args, api, extraOptions);
      
      // Handle API errors (4xx, 5xx responses)
      if (result.error) {
        const { status, data } = result.error;
        let errorMessage = 'An unexpected error occurred';
        
        // Extract error message if available
        if (data && typeof data === 'object' && 'message' in data) {
          errorMessage = String(data.message);
        }
        
        // Don't show global error for 401 Unauthorized as it's typically handled by auth flow
        if (status !== 401) {
          handleGlobalError(errorMessage, `API Error (${status})`);
        }
      }
      
      return result;
    } catch (error) {
      // Handle unexpected errors (network issues, etc.)
      handleGlobalError(error, 'Network Error');
      throw error;
    }
  },
  tagTypes: ['Auth', 'Account'], // Define tag types for cache invalidation
  endpoints: () => ({}), // Start with empty endpoints
});

export default baseApi;
