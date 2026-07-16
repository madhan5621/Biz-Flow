import PageWrapper from '../../components/layout/PageWrapper';
import { FileText } from 'lucide-react';

const InvoicesPage = () => (
  <PageWrapper>
    <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-100 mb-6">Invoices</h1>
    <div className="card p-12 text-center">
      <FileText className="w-12 h-12 text-surface-300 dark:text-surface-600 mx-auto mb-4" />
      <p className="text-surface-500 dark:text-surface-400">Invoice system will be implemented in Phase 7.</p>
    </div>
  </PageWrapper>
);

export default InvoicesPage;
