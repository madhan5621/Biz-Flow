import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/api';

/**
 * Fetch customers with search, filter, sort, and pagination.
 */
export const useCustomers = (params = {}) => {
  return useQuery({
    queryKey: ['customers', params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== '' && value !== null && value !== undefined) {
          searchParams.set(key, String(value));
        }
      });
      const { data } = await api.get(`/customers?${searchParams.toString()}`);
      return data;
    },
    keepPreviousData: true,
  });
};

/**
 * Fetch a single customer by ID (includes purchase history).
 */
export const useCustomer = (id) => {
  return useQuery({
    queryKey: ['customers', id],
    queryFn: async () => {
      const { data } = await api.get(`/customers/${id}`);
      return data.data;
    },
    enabled: !!id,
  });
};

/**
 * Fetch unique cities for filter dropdown.
 */
export const useCities = () => {
  return useQuery({
    queryKey: ['customers', 'cities'],
    queryFn: async () => {
      const { data } = await api.get('/customers/cities');
      return data.data;
    },
  });
};

/**
 * Create a new customer.
 */
export const useCreateCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (customerData) => {
      const { data } = await api.post('/customers', customerData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
};

/**
 * Update a customer.
 */
export const useUpdateCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }) => {
      const { data: response } = await api.put(`/customers/${id}`, data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
};

/**
 * Delete a customer.
 */
export const useDeleteCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const { data } = await api.delete(`/customers/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
};
