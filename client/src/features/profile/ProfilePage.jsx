import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Shield,
  Calendar,
  Lock,
  Save,
  Eye,
  EyeOff,
} from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper';
import { Button, Input, Badge } from '../../components/ui';
import { Spinner } from '../../components/ui';
import { useProfile, useUpdateProfile, useChangePassword } from './useProfile';
import { useToast } from '../../providers/ToastProvider';
import { formatDate, getInitials, getAvatarColor } from '../../lib/utils';

const roleVariants = {
  ADMIN: 'danger',
  MANAGER: 'warning',
  EMPLOYEE: 'default',
};

const ProfilePage = () => {
  const toast = useToast();

  const { data: profile, isLoading } = useProfile();
  const updateMutation = useUpdateProfile();
  const passwordMutation = useChangePassword();

  // Profile form
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  // Password form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  useEffect(() => {
    if (profile) {
      setName(profile.name || '');
      setEmail(profile.email || '');
    }
  }, [profile]);

  const handleUpdateProfile = async () => {
    try {
      await updateMutation.mutateAsync({ name, email });
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    try {
      await passwordMutation.mutateAsync({
        currentPassword,
        newPassword,
      });
      toast.success('Password changed successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change password');
    }
  };

  if (isLoading) {
    return (
      <PageWrapper>
        <div className="flex items-center justify-center py-20">
          <Spinner size="lg" />
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-100 flex items-center gap-2">
          <User className="w-6 h-6 text-primary-500" />
          My Profile
        </h1>
        <p className="text-surface-500 dark:text-surface-400 text-sm mt-0.5">
          Manage your account settings and security
        </p>
      </div>

      <div className="space-y-6 max-w-3xl">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card p-6"
        >
          <div className="flex items-center gap-5 pb-6 border-b border-surface-100 dark:border-surface-700">
            <div
              className={`w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-bold ${getAvatarColor(
                profile?.name
              )}`}
            >
              {getInitials(profile?.name)}
            </div>
            <div>
              <h2 className="text-xl font-bold text-surface-900 dark:text-surface-100">
                {profile?.name}
              </h2>
              <p className="text-sm text-surface-500 dark:text-surface-400">{profile?.email}</p>
              <div className="flex items-center gap-3 mt-2">
                <Badge variant={roleVariants[profile?.role] || 'default'} size="sm">
                  {profile?.role}
                </Badge>
                <span className="flex items-center gap-1 text-xs text-surface-400 dark:text-surface-500">
                  <Calendar className="w-3 h-3" />
                  Joined {formatDate(profile?.createdAt)}
                </span>
              </div>
            </div>
          </div>

          {/* Edit Profile */}
          <div className="pt-6 space-y-4">
            <h3 className="text-sm font-semibold text-surface-900 dark:text-surface-100 flex items-center gap-2">
              <Mail className="w-4 h-4 text-surface-400" />
              Account Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
              />
              <Input
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
              />
            </div>
            <div className="flex justify-end">
              <Button
                size="sm"
                leftIcon={Save}
                onClick={handleUpdateProfile}
                isLoading={updateMutation.isPending}
              >
                Save Profile
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Change Password */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card p-6"
        >
          <div className="flex items-center gap-3 mb-5 pb-4 border-b border-surface-100 dark:border-surface-700">
            <div className="w-10 h-10 rounded-xl bg-warning-50 dark:bg-warning-900/20 flex items-center justify-center">
              <Lock className="w-5 h-5 text-warning-600 dark:text-warning-400" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-surface-900 dark:text-surface-100">
                Change Password
              </h2>
              <p className="text-xs text-surface-500 dark:text-surface-400">
                Update your password for enhanced security
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <Input
                label="Current Password"
                type={showCurrent ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
              />
              <button
                type="button"
                className="absolute right-3 top-8 text-surface-400 hover:text-surface-600 dark:hover:text-surface-300"
                onClick={() => setShowCurrent(!showCurrent)}
              >
                {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="relative">
                <Input
                  label="New Password"
                  type={showNew ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-8 text-surface-400 hover:text-surface-600 dark:hover:text-surface-300"
                  onClick={() => setShowNew(!showNew)}
                >
                  {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <Input
                label="Confirm New Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
              />
            </div>

            <div className="flex justify-end">
              <Button
                size="sm"
                variant="secondary"
                leftIcon={Shield}
                onClick={handleChangePassword}
                isLoading={passwordMutation.isPending}
                disabled={!currentPassword || !newPassword || !confirmPassword}
              >
                Update Password
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </PageWrapper>
  );
};

export default ProfilePage;
