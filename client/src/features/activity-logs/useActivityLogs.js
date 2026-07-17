import { useQuery } from '@tanstack/react-query';
import api from '../../lib/api';

/**
 * Fetch activity logs with search, filter, and pagination.
 */
export const useActivityLogs = (params = {}) => {
  return useQuery({
    queryKey: ['activity-logs', params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== '' && value !== null && value !== undefined) {
          searchParams.set(key, String(value));
        }
      });
      const { data } = await api.get(`/activity-logs?${searchParams.toString()}`);
      return data;
    },
    keepPreviousData: true,
  });
};

/**
 * Fetch unique action types for filter dropdown.
 */
export const useLogActions = () => {
  return useQuery({
    queryKey: ['activity-logs', 'actions'],
    queryFn: async () => {
      const { data } = await api.get('/activity-logs/actions');
      return data.data;
    },
  });
};

/**
 * Fetch unique entity types for filter dropdown.
 */
export const useLogEntities = () => {
  return useQuery({
    queryKey: ['activity-logs', 'entities'],
    queryFn: async () => {
      const { data } = await api.get('/activity-logs/entities');
      return data.data;
    },
  });
};
