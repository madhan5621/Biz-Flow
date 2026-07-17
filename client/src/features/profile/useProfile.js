import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/api';
import { useAuth } from '../../providers/AuthProvider';

/**
 * Fetch current user profile.
 */
export const useProfile = () => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data } = await api.get('/auth/me');
      return data.data;
    },
  });
};

/**
 * Update user profile.
 */
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const { updateUser } = useAuth();

  return useMutation({
    mutationFn: async (profileData) => {
      const { data } = await api.put('/auth/me', profileData);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      if (data.data) {
        updateUser(data.data);
      }
    },
  });
};

/**
 * Change user password.
 */
export const useChangePassword = () => {
  return useMutation({
    mutationFn: async (passwordData) => {
      const { data } = await api.put('/auth/change-password', passwordData);
      return data;
    },
  });
};
