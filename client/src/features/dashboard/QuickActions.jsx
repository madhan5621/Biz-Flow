import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  UserPlus,
  Package,
  FileText,
  Receipt,
  Users,
  ChartColumn,
} from 'lucide-react';

const actions = [
  {
    label: 'New Invoice',
    icon: FileText,
    href: '/invoices',
    color: 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400',
    hoverColor: 'hover:bg-primary-100 dark:hover:bg-primary-900/30',
  },
  {
    label: 'Add Customer',
    icon: UserPlus,
    href: '/customers',
    color: 'bg-success-50 dark:bg-success-900/20 text-success-600 dark:text-success-400',
    hoverColor: 'hover:bg-success-100 dark:hover:bg-success-900/30',
  },
  {
    label: 'Add Product',
    icon: Package,
    href: '/products',
    color: 'bg-warning-50 dark:bg-warning-900/20 text-warning-600 dark:text-warning-400',
    hoverColor: 'hover:bg-warning-100 dark:hover:bg-warning-900/30',
  },
  {
    label: 'Add Expense',
    icon: Receipt,
    href: '/expenses',
    color: 'bg-danger-50 dark:bg-danger-900/20 text-danger-600 dark:text-danger-400',
    hoverColor: 'hover:bg-danger-100 dark:hover:bg-danger-900/30',
  },
  {
    label: 'Employees',
    icon: Users,
    href: '/employees',
    color: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
    hoverColor: 'hover:bg-purple-100 dark:hover:bg-purple-900/30',
  },
  {
    label: 'Reports',
    icon: ChartColumn,
    href: '/reports',
    color: 'bg-cyan-50 dark:bg-cyan-900/20 text-cyan-600 dark:text-cyan-400',
    hoverColor: 'hover:bg-cyan-100 dark:hover:bg-cyan-900/30',
  },
];

const QuickActions = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.7 }}
      className="card p-5"
    >
      <h3 className="text-base font-semibold text-surface-900 dark:text-surface-100 mb-4">
        Quick Actions
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {actions.map((action, i) => {
          const Icon = action.icon;
          return (
            <Link
              key={i}
              to={action.href}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl transition-all duration-200 ${action.color} ${action.hoverColor} group`}
            >
              <Icon className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
              <span className="text-xs font-medium text-center">{action.label}</span>
            </Link>
          );
        })}
      </div>
    </motion.div>
  );
};

export default QuickActions;
