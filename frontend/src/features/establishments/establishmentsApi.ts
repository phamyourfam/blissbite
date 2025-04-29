import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../../app/store';
import { selectSessionToken } from '../../features/auth/authSlice';

export interface Product {
  id: string;
  name: string;
  description: string;
  base_price: number;
  is_available: boolean;
  image_url?: string;
  categories?: {
    id: string;
    name: string;
  }[];
}

export interface Establishment {
  id: string;
  name: string;
  address: string;
  description: string;
  productsCount: number;
  status: 'active' | 'inactive';
  products?: Product[];
}

export interface EstablishmentFormValues {
  name: string;
  address: string;
  description: string;
  status: 'active' | 'inactive';
}

export interface ProductFormValues {
  name: string;
  description?: string;
  base_price: number;
  is_available: boolean;
  image_url?: string;
  preparation_time?: number;
}

export interface EstablishmentsResponse {
  establishments: Establishment[];
  pagination: {
    currentPage: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}

export const establishmentsApi = createApi({
  reducerPath: 'establishmentsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_API_BASE_URL}/${process.env.REACT_APP_API_VERSION}`,
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
      const token = selectSessionToken(getState() as RootState);
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Establishments', 'Products'],
  endpoints: (builder) => ({
    getEstablishments: builder.query<EstablishmentsResponse, { page?: number; limit?: number }>({
      query: ({ page = 1, limit = 10 } = {}) => `/establishments?page=${page}&limit=${limit}`,
      providesTags: ['Establishments']
    }),
    getEstablishment: builder.query<Establishment, string>({
      query: (id) => `/establishments/${id}`,
      providesTags: (result, error, id) => [{ type: 'Establishments', id }]
    }),
    createEstablishment: builder.mutation<Establishment, EstablishmentFormValues>({
      query: (body) => ({
        url: '/establishments',
        method: 'POST',
        body
      }),
      invalidatesTags: ['Establishments']
    }),
    updateEstablishment: builder.mutation<Establishment, { id: string; data: EstablishmentFormValues }>({
      query: ({ id, data }) => ({
        url: `/establishments/${id}`,
        method: 'PUT',
        body: data
      }),
      invalidatesTags: ['Establishments']
    }),
    deleteEstablishment: builder.mutation<void, string>({
      query: (id) => ({
        url: `/establishments/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Establishments']
    }),
    getProducts: builder.query<Product[], string>({
      query: (establishmentId) => `/establishments/${establishmentId}/products`,
      providesTags: (result, error, establishmentId) => [
        { type: 'Products', id: establishmentId }
      ]
    }),
    createProduct: builder.mutation<Product, { establishmentId: string; data: ProductFormValues }>({
      query: ({ establishmentId, data }) => ({
        url: `/establishments/${establishmentId}/products`,
        method: 'POST',
        body: data
      }),
      invalidatesTags: (result, error, { establishmentId }) => [
        { type: 'Products', id: establishmentId }
      ]
    }),
    updateProduct: builder.mutation<Product, { establishmentId: string; productId: string; data: Partial<ProductFormValues> }>({
      query: ({ establishmentId, productId, data }) => ({
        url: `/establishments/${establishmentId}/products/${productId}`,
        method: 'PUT',
        body: data
      }),
      invalidatesTags: (result, error, { establishmentId }) => [
        { type: 'Products', id: establishmentId }
      ]
    }),
    deleteProduct: builder.mutation<void, { establishmentId: string; productId: string }>({
      query: ({ establishmentId, productId }) => ({
        url: `/establishments/${establishmentId}/products/${productId}`,
        method: 'DELETE'
      }),
      invalidatesTags: (result, error, { establishmentId }) => [
        { type: 'Products', id: establishmentId }
      ]
    })
  })
});

export const {
  useGetEstablishmentsQuery,
  useGetEstablishmentQuery,
  useCreateEstablishmentMutation,
  useUpdateEstablishmentMutation,
  useDeleteEstablishmentMutation,
  useGetProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation
} = establishmentsApi; 