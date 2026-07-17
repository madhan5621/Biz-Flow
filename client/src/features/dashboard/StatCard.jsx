import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Package,
  FileText,
  ShoppingCart,
  AlertTriangle,
} from 'lucide-react';
import { formatCurrency, formatNumber } from '../../lib/utils';

const iconMap = {
  revenue: DollarSign,
  expenses: TrendingDown,
  profit: TrendingUp,
  customers: Users,
  products: Package,
  invoices: FileText,
  orders: ShoppingCart,
  lowStock: AlertTriangle,
};

const colorMap = {
  revenue: {
    bg: 'bg-primary-50 dark:bg-primary-900/20',
    icon: 'text-primary-600 dark:text-primary-400',
    accent: 'bg-primary-500',
    glow: 'shadow-glow-primary',
  },
  expenses: {
    bg: 'bg-danger-50 dark:bg-danger-900/20',
    icon: 'text-danger-600 dark:text-danger-400',
    accent: 'bg-danger-500',
    glow: 'shadow-glow-danger',
  },
  profit: {
    bg: 'bg-success-50 dark:bg-success-900/20',
    icon: 'text-success-600 dark:text-success-400',
    accent: 'bg-success-500',
    glow: 'shadow-glow-success',
  },
  customers: {
    bg: 'bg-purple-50 dark:bg-purple-900/20',
    icon: 'text-purple-600 dark:text-purple-400',
    accent: 'bg-purple-500',
    glow: '',
  },
  products: {
    bg: 'bg-cyan-50 dark:bg-cyan-900/20',
    icon: 'text-cyan-600 dark:text-cyan-400',
    accent: 'bg-cyan-500',
    glow: '',
  },
  invoices: {
    bg: 'bg-warning-50 dark:bg-warning-900/20',
    icon: 'text-warning-600 dark:text-warning-400',
    accent: 'bg-warning-500',
    glow: '',
  },
  lowStock: {
    bg: 'bg-danger-50 dark:bg-danger-900/20',
    icon: 'text-danger-600 dark:text-danger-400',
    accent: 'bg-danger-500',
    glow: '',
  },
};

const StatCard = ({
  title,
  value,
  type = 'revenue',
  isCurrency = false,
  subtitle,
  change,
  index = 0,
}) => {
  const Icon = iconMap[type] || DollarSign;
  const colors = colorMap[type] || colorMap.revenue;
  const displayValue = isCurrency ? formatCurrency(value) : formatNumber(value);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: 'easeOut' }}
      className="stat-card group"
    >
      {/* Left accent bar */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-xl ${colors.accent} opacity-80`} />

      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-surface-500 dark:text-surface-400 mb-1">
            {title}
          </p>
          <p className="text-2xl font-bold text-surface-900 dark:text-surface-100 tracking-tight">
            {displayValue}
          </p>
          {subtitle && (
            <p className="text-xs text-surface-400 dark:text-surface-500 mt-1">
              {subtitle}
            </p>
          )}
          {change !== undefined && (
            <div className="flex items-center gap-1 mt-2">
              {change >= 0 ? (
                <TrendingUp className="w-3.5 h-3.5 text-success-500" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5 text-danger-500" />
              )}
              <span
                className={`text-xs font-semibold ${
                  change >= 0 ? 'text-success-600 dark:text-success-400' : 'text-danger-600 dark:text-danger-400'
                }`}
              >
                {change >= 0 ? '+' : ''}{change}%
              </span>
              <span className="text-xs text-surface-400 dark:text-surface-500">vs last month</span>
            </div>
          )}
        </div>

        <div
          className={`flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center ${colors.bg} transition-transform duration-300 group-hover:scale-110`}
        >
          <Icon className={`w-5 h-5 ${colors.icon}`} />
        </div>
      </div>
    </motion.div>
  );
};

export default StatCard;
