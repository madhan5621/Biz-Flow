import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/api';

/**
 * Fetch categories with search, sort, and pagination.
 */
export const useCategories = (params = {}) => {
  return useQuery({
    queryKey: ['categories', params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== '' && value !== null && value !== undefined) {
          searchParams.set(key, String(value));
        }
      });
      const { data } = await api.get(`/categories?${searchParams.toString()}`);
      return data;
    },
    keepPreviousData: true,
  });
};

/**
 * Fetch lightweight category list for dropdowns.
 */
export const useCategoriesList = () => {
  return useQuery({
    queryKey: ['categories', 'list'],
    queryFn: async () => {
      const { data } = await api.get('/categories/list');
      return data.data;
    },
  });
};

/**
 * Create a new category.
 */
export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (categoryData) => {
      const { data } = await api.post('/categories', categoryData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
};

/**
 * Update a category.
 */
export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }) => {
      const { data: response } = await api.put(`/categories/${id}`, data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
};

/**
 * Delete a category.
 */
export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const { data } = await api.delete(`/categories/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
};
