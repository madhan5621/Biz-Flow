import PageWrapper from '../../components/layout/PageWrapper';
import { UserCircle } from 'lucide-react';

const CustomersPage = () => (
  <PageWrapper>
    <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-100 mb-6">Customers</h1>
    <div className="card p-12 text-center">
      <UserCircle className="w-12 h-12 text-surface-300 dark:text-surface-600 mx-auto mb-4" />
      <p className="text-surface-500 dark:text-surface-400">Customer management will be implemented in Phase 5.</p>
    </div>
  </PageWrapper>
);

export default CustomersPage;
