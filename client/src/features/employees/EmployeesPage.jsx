import PageWrapper from '../../components/layout/PageWrapper';
import { Users } from 'lucide-react';

const EmployeesPage = () => {
  return (
    <PageWrapper>
      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-100">
          Employees
        </h1>
      </div>
      <div className="card p-12 text-center">
        <Users className="w-12 h-12 text-surface-300 dark:text-surface-600 mx-auto mb-4" />
        <p className="text-surface-500 dark:text-surface-400">
          Employee management will be implemented in Phase 4.
        </p>
      </div>
    </PageWrapper>
  );
};

export default EmployeesPage;
