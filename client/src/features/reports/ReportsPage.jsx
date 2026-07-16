import PageWrapper from '../../components/layout/PageWrapper';
import { BarChart3 } from 'lucide-react';

const ReportsPage = () => (
  <PageWrapper>
    <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-100 mb-6">Reports</h1>
    <div className="card p-12 text-center">
      <BarChart3 className="w-12 h-12 text-surface-300 dark:text-surface-600 mx-auto mb-4" />
      <p className="text-surface-500 dark:text-surface-400">Reports dashboard will be implemented in Phase 8.</p>
    </div>
  </PageWrapper>
);

export default ReportsPage;
