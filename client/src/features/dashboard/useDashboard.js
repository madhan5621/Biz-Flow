import { useQuery } from '@tanstack/react-query';
import api from '../../lib/api';

/**
 * Fetch dashboard overview stats.
 */
export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: async () => {
      const { data } = await api.get('/dashboard/stats');
      return data.data;
    },
  });
};

/**
 * Fetch revenue chart data (12 months).
 */
export const useRevenueChart = () => {
  return useQuery({
    queryKey: ['dashboard', 'revenue-chart'],
    queryFn: async () => {
      const { data } = await api.get('/dashboard/revenue-chart');
      return data.data;
    },
  });
};

/**
 * Fetch expense breakdown by category.
 */
export const useExpenseChart = () => {
  return useQuery({
    queryKey: ['dashboard', 'expense-chart'],
    queryFn: async () => {
      const { data } = await api.get('/dashboard/expense-chart');
      return data.data;
    },
  });
};

/**
 * Fetch recent activity logs.
 */
export const useRecentActivities = (limit = 10) => {
  return useQuery({
    queryKey: ['dashboard', 'recent-activities', limit],
    queryFn: async () => {
      const { data } = await api.get(`/dashboard/recent-activities?limit=${limit}`);
      return data.data;
    },
  });
};

/**
 * Fetch top selling products.
 */
export const useTopProducts = (limit = 5) => {
  return useQuery({
    queryKey: ['dashboard', 'top-products', limit],
    queryFn: async () => {
      const { data } = await api.get(`/dashboard/top-products?limit=${limit}`);
      return data.data;
    },
  });
};
