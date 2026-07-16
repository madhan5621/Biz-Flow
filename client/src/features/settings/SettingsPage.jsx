import PageWrapper from '../../components/layout/PageWrapper';
import { Settings } from 'lucide-react';

const SettingsPage = () => (
  <PageWrapper>
    <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-100 mb-6">Settings</h1>
    <div className="card p-12 text-center">
      <Settings className="w-12 h-12 text-surface-300 dark:text-surface-600 mx-auto mb-4" />
      <p className="text-surface-500 dark:text-surface-400">Settings page will be implemented in Phase 9.</p>
    </div>
  </PageWrapper>
);

export default SettingsPage;
