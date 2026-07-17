import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/api';

/**
 * Fetch suppliers with search, filter, sort, and pagination.
 */
export const useSuppliers = (params = {}) => {
  return useQuery({
    queryKey: ['suppliers', params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== '' && value !== null && value !== undefined) {
          searchParams.set(key, String(value));
        }
      });
      const { data } = await api.get(`/suppliers?${searchParams.toString()}`);
      return data;
    },
    keepPreviousData: true,
  });
};

/**
 * Fetch a single supplier by ID (includes products supplied).
 */
export const useSupplier = (id) => {
  return useQuery({
    queryKey: ['suppliers', id],
    queryFn: async () => {
      const { data } = await api.get(`/suppliers/${id}`);
      return data.data;
    },
    enabled: !!id,
  });
};

/**
 * Fetch lightweight supplier list for dropdowns.
 */
export const useSuppliersList = () => {
  return useQuery({
    queryKey: ['suppliers', 'list'],
    queryFn: async () => {
      const { data } = await api.get('/suppliers/list');
      return data.data;
    },
  });
};

/**
 * Create a new supplier.
 */
export const useCreateSupplier = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (supplierData) => {
      const { data } = await api.post('/suppliers', supplierData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
};

/**
 * Update a supplier.
 */
export const useUpdateSupplier = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }) => {
      const { data: response } = await api.put(`/suppliers/${id}`, data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
};

/**
 * Delete a supplier.
 */
export const useDeleteSupplier = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const { data } = await api.delete(`/suppliers/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
};
