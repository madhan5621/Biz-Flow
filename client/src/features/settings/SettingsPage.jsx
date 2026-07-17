import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Settings,
  Building2,
  Globe,
  CreditCard,
  Bell,
  Shield,
  Save,
} from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper';
import { Button, Input, Select, Textarea } from '../../components/ui';
import { Spinner } from '../../components/ui';
import { useSettings, useUpdateSettings } from './useSettings';
import { useToast } from '../../providers/ToastProvider';
import { useAuth } from '../../providers/AuthProvider';

const CURRENCIES = [
  { value: 'INR', label: '₹ INR — Indian Rupee' },
  { value: 'USD', label: '$ USD — US Dollar' },
  { value: 'EUR', label: '€ EUR — Euro' },
  { value: 'GBP', label: '£ GBP — British Pound' },
];

const TIMEZONES = [
  { value: 'Asia/Kolkata', label: 'Asia/Kolkata (IST)' },
  { value: 'America/New_York', label: 'America/New_York (EST)' },
  { value: 'America/Chicago', label: 'America/Chicago (CST)' },
  { value: 'America/Los_Angeles', label: 'America/Los_Angeles (PST)' },
  { value: 'Europe/London', label: 'Europe/London (GMT)' },
  { value: 'Europe/Berlin', label: 'Europe/Berlin (CET)' },
  { value: 'Asia/Tokyo', label: 'Asia/Tokyo (JST)' },
  { value: 'Australia/Sydney', label: 'Australia/Sydney (AEST)' },
];

const LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'hi', label: 'Hindi' },
  { value: 'ta', label: 'Tamil' },
  { value: 'te', label: 'Telugu' },
];

const SectionCard = ({ icon: Icon, title, description, children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4 }}
    className="card p-6"
  >
    <div className="flex items-center gap-3 mb-5 pb-4 border-b border-surface-100 dark:border-surface-700">
      <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center">
        <Icon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
      </div>
      <div>
        <h2 className="text-base font-semibold text-surface-900 dark:text-surface-100">{title}</h2>
        <p className="text-xs text-surface-500 dark:text-surface-400">{description}</p>
      </div>
    </div>
    {children}
  </motion.div>
);

const SettingsPage = () => {
  const toast = useToast();
  const { isAdmin } = useAuth();

  const { data: settings, isLoading } = useSettings();
  const updateMutation = useUpdateSettings();

  const [formData, setFormData] = useState({
    businessName: '',
    gstNumber: '',
    email: '',
    phone: '',
    address: '',
    currency: 'INR',
    timezone: 'Asia/Kolkata',
    language: 'en',
  });

  useEffect(() => {
    if (settings) {
      setFormData({
        businessName: settings.businessName || '',
        gstNumber: settings.gstNumber || '',
        email: settings.email || '',
        phone: settings.phone || '',
        address: settings.address || '',
        currency: settings.currency || 'INR',
        timezone: settings.timezone || 'Asia/Kolkata',
        language: settings.language || 'en',
      });
    }
  }, [settings]);

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSave = async () => {
    try {
      await updateMutation.mutateAsync({
        ...formData,
        gstNumber: formData.gstNumber || null,
        email: formData.email || null,
        phone: formData.phone || null,
        address: formData.address || null,
      });
      toast.success('Settings updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update settings');
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-100 flex items-center gap-2">
            <Settings className="w-6 h-6 text-primary-500" />
            Settings
          </h1>
          <p className="text-surface-500 dark:text-surface-400 text-sm mt-0.5">
            Configure your business settings and preferences
          </p>
        </div>

        {isAdmin && (
          <Button
            leftIcon={Save}
            onClick={handleSave}
            isLoading={updateMutation.isPending}
          >
            Save Changes
          </Button>
        )}
      </div>

      <div className="space-y-6 max-w-3xl">
        {/* Business Information */}
        <SectionCard
          icon={Building2}
          title="Business Information"
          description="Your company details used on invoices and reports"
          delay={0.1}
        >
          <div className="space-y-4">
            <Input
              label="Business Name"
              value={formData.businessName}
              onChange={handleChange('businessName')}
              placeholder="Your Company Name"
              disabled={!isAdmin}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Email"
                type="email"
                value={formData.email}
                onChange={handleChange('email')}
                placeholder="contact@company.com"
                disabled={!isAdmin}
              />
              <Input
                label="Phone"
                value={formData.phone}
                onChange={handleChange('phone')}
                placeholder="+91 98765 43210"
                disabled={!isAdmin}
              />
            </div>
            <Input
              label="GST Number"
              value={formData.gstNumber}
              onChange={handleChange('gstNumber')}
              placeholder="e.g. 22AAAAA0000A1Z5"
              disabled={!isAdmin}
            />
            <Textarea
              label="Address"
              value={formData.address}
              onChange={handleChange('address')}
              placeholder="Business address"
              rows={2}
              disabled={!isAdmin}
            />
          </div>
        </SectionCard>

        {/* Regional Settings */}
        <SectionCard
          icon={Globe}
          title="Regional Settings"
          description="Currency, timezone, and language preferences"
          delay={0.2}
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Select
              label="Currency"
              options={CURRENCIES}
              value={formData.currency}
              onChange={handleChange('currency')}
              disabled={!isAdmin}
            />
            <Select
              label="Timezone"
              options={TIMEZONES}
              value={formData.timezone}
              onChange={handleChange('timezone')}
              disabled={!isAdmin}
            />
            <Select
              label="Language"
              options={LANGUAGES}
              value={formData.language}
              onChange={handleChange('language')}
              disabled={!isAdmin}
            />
          </div>
        </SectionCard>

        {/* Security Info */}
        <SectionCard
          icon={Shield}
          title="Security"
          description="Authentication and access control info"
          delay={0.3}
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between py-3 px-4 rounded-lg bg-surface-50 dark:bg-surface-800">
              <div>
                <p className="text-sm font-medium text-surface-900 dark:text-surface-100">JWT Authentication</p>
                <p className="text-xs text-surface-500 dark:text-surface-400">Access + Refresh token rotation</p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-400">
                Active
              </span>
            </div>
            <div className="flex items-center justify-between py-3 px-4 rounded-lg bg-surface-50 dark:bg-surface-800">
              <div>
                <p className="text-sm font-medium text-surface-900 dark:text-surface-100">Rate Limiting</p>
                <p className="text-xs text-surface-500 dark:text-surface-400">100 requests / 15 min (API), 10 / 15 min (Auth)</p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-400">
                Active
              </span>
            </div>
            <div className="flex items-center justify-between py-3 px-4 rounded-lg bg-surface-50 dark:bg-surface-800">
              <div>
                <p className="text-sm font-medium text-surface-900 dark:text-surface-100">Role-Based Access</p>
                <p className="text-xs text-surface-500 dark:text-surface-400">Admin, Manager, Employee</p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-400">
                Active
              </span>
            </div>
          </div>
        </SectionCard>
      </div>
    </PageWrapper>
  );
};

export default SettingsPage;
