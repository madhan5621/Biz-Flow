import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '../../lib/utils';

const routeLabels = {
  dashboard: 'Dashboard',
  employees: 'Employees',
  customers: 'Customers',
  products: 'Products',
  categories: 'Categories',
  suppliers: 'Suppliers',
  invoices: 'Invoices',
  expenses: 'Expenses',
  reports: 'Reports',
  notifications: 'Notifications',
  'activity-logs': 'Activity Logs',
  settings: 'Settings',
  profile: 'Profile',
  new: 'New',
  edit: 'Edit',
};

const Breadcrumbs = ({ className }) => {
  const location = useLocation();
  const segments = location.pathname.split('/').filter(Boolean);

  if (segments.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className={cn('hidden md:flex items-center gap-1.5 text-sm', className)}>
      <Link
        to="/dashboard"
        className="text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 transition-colors"
      >
        <Home className="w-4 h-4" />
      </Link>

      {segments.map((segment, index) => {
        const path = `/${segments.slice(0, index + 1).join('/')}`;
        const isLast = index === segments.length - 1;
        const label = routeLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);

        return (
          <span key={path} className="flex items-center gap-1.5">
            <ChevronRight className="w-3.5 h-3.5 text-surface-400" />
            {isLast ? (
              <span className="font-medium text-surface-900 dark:text-surface-100">
                {label}
              </span>
            ) : (
              <Link
                to={path}
                className="text-surface-500 hover:text-surface-700 dark:text-surface-400 dark:hover:text-surface-200 transition-colors"
              >
                {label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
};

export default Breadcrumbs;
