import { useQuery } from '@tanstack/react-query';
import api from '../../lib/api';

/**
 * Fetch revenue report data (monthly revenue, expenses, profit).
 */
export const useRevenueReport = (months = 12) => {
  return useQuery({
    queryKey: ['reports', 'revenue', months],
    queryFn: async () => {
      const { data } = await api.get(`/reports/revenue?months=${months}`);
      return data.data;
    },
  });
};

/**
 * Fetch expense breakdown report (by category).
 */
export const useExpenseReport = () => {
  return useQuery({
    queryKey: ['reports', 'expenses'],
    queryFn: async () => {
      const { data } = await api.get('/reports/expenses');
      return data.data;
    },
  });
};

/**
 * Fetch product performance report (top sellers, low stock).
 */
export const useProductReport = () => {
  return useQuery({
    queryKey: ['reports', 'products'],
    queryFn: async () => {
      const { data } = await api.get('/reports/products');
      return data.data;
    },
  });
};

/**
 * Download CSV export.
 */
export const useExportCSV = () => {
  const exportReport = async (type) => {
    const response = await api.get(`/reports/export/csv?type=${type}`, {
      responseType: 'blob',
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${type}_report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  };

  return { exportReport };
};
