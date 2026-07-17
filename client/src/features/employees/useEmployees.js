import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/api';

/**
 * Fetch employees with search, filter, sort, and pagination.
 */
export const useEmployees = (params = {}) => {
  return useQuery({
    queryKey: ['employees', params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== '' && value !== null && value !== undefined) {
          searchParams.set(key, String(value));
        }
      });
      const { data } = await api.get(`/employees?${searchParams.toString()}`);
      return data;
    },
    keepPreviousData: true,
  });
};

/**
 * Fetch a single employee by ID.
 */
export const useEmployee = (id) => {
  return useQuery({
    queryKey: ['employees', id],
    queryFn: async () => {
      const { data } = await api.get(`/employees/${id}`);
      return data.data;
    },
    enabled: !!id,
  });
};

/**
 * Fetch unique departments for filter dropdown.
 */
export const useDepartments = () => {
  return useQuery({
    queryKey: ['employees', 'departments'],
    queryFn: async () => {
      const { data } = await api.get('/employees/departments');
      return data.data;
    },
  });
};

/**
 * Create a new employee.
 */
export const useCreateEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (employeeData) => {
      const { data } = await api.post('/employees', employeeData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
};

/**
 * Update an employee.
 */
export const useUpdateEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }) => {
      const { data: response } = await api.put(`/employees/${id}`, data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
};

/**
 * Delete an employee.
 */
export const useDeleteEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const { data } = await api.delete(`/employees/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
};

/**
 * Download employee CSV export.
 */
export const exportEmployeesCSV = async (params = {}) => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== '' && value !== null && value !== undefined) {
      searchParams.set(key, String(value));
    }
  });

  const response = await api.get(`/employees/export/csv?${searchParams.toString()}`, {
    responseType: 'blob',
  });

  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `employees_${Date.now()}.csv`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};
